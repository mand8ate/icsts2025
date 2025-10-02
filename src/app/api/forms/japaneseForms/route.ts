import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { Parser } from "json2csv";

export async function GET() {
	try {
		const session = await getAuthSession();
		if (!session) {
			return new NextResponse(
				JSON.stringify({ error: "Unauthorized access" }),
				{ status: 401 }
			);
		}

		const japaneseForms = await db.japaneseForm.findMany({
			orderBy: {
				incrementId: "asc", // Add explicit ordering
			},
		});

		if (!japaneseForms || japaneseForms.length === 0) {
			return new NextResponse(
				JSON.stringify({ error: "There are no forms" })
			);
		}

		const parser = new Parser();
		const csv = parser.parse(japaneseForms);

		const response = new NextResponse(csv, { status: 200 });
		response.headers.set("Content-Type", "text/csv");
		response.headers.set(
			"Content-Disposition",
			"attachment; filename=japaneseForms.csv"
		);

		return response;
	} catch (error) {
		console.error("Error generating CSV:", error);
		return new NextResponse(
			JSON.stringify({ error: "Failed to generate CSV" }),
			{ status: 500 }
		);
	}
}
