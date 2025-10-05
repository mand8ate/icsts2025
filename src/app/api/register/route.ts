import { db } from "@/lib/db";
import { englishFormSchema } from "@/lib/validation/formValidator";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import sgMail from "@sendgrid/mail";
import { generateEmailContent } from "@/components/EmailTemplate";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { data, recaptchaToken } = body;

		const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
		if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
			return new NextResponse(
				JSON.stringify({
					error: "Security check failed. Please try again.",
				}),
				{ status: 400 }
			);
		}

		const validatedFields = englishFormSchema.safeParse(data);
		if (!validatedFields.success) {
			return new NextResponse(
				JSON.stringify({
					errors: validatedFields.error.flatten().fieldErrors,
				}),
				{ status: 400 }
			);
		}

		const existingUserEnglish = await db.englishForm.findUnique({
			where: {
				email: validatedFields.data.email,
			},
		});

		const existingUserJapanese = await db.japaneseForm.findUnique({
			where: {
				email: validatedFields.data.email,
			},
		});

		if (existingUserEnglish || existingUserJapanese) {
			return new NextResponse(
				JSON.stringify({
					error: "Email is already registered",
				}),
				{ status: 400 }
			);
		}

		const registration = await db.englishForm.create({
			data: validatedFields.data,
		});

		const updatedRegistration = await db.englishForm.update({
			where: { id: registration.id },
			data: {
				referenceNumber: `E${registration.incrementId
					.toString()
					.padStart(4, "0")}`,
			},
		});

		try {
			const emailContent = generateEmailContent(updatedRegistration);
			await sgMail.send({
				to: updatedRegistration.email,
				from: process.env.SENDGRID_FROM_EMAIL!,
				bcc: process.env.SENDGRID_FROM_EMAIL!,
				subject: emailContent.subject,
				text: emailContent.text,
				html: emailContent.html,
			});
		} catch (emailError) {
			console.error("Failed to send email:", emailError);
			try {
				await db.englishForm.delete({
					where: { id: updatedRegistration.id },
				});
			} catch (deleteError) {
				console.error(
					"Failed to delete registration during rollback:",
					deleteError
				);
			}
			return new NextResponse(
				JSON.stringify({
					error: "Email sending failed. Please try again later.",
				}),
				{ status: 500 }
			);
		}

		return new NextResponse(
			JSON.stringify({
				message: "Registration successful",
				referenceNumber: updatedRegistration.referenceNumber,
			}),
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new NextResponse(
				JSON.stringify({ errors: error.flatten().fieldErrors }),
				{ status: 400 }
			);
		}
		console.error("Registration error:", error);
		return new NextResponse(
			JSON.stringify({ error: "Internal server error" }),
			{ status: 500 }
		);
	}
}
