import { db } from "@/lib/db";
import { japaneseFormSchema } from "@/lib/validation/formValidatorJp";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import sgMail from "@sendgrid/mail";
import { generateEmailContentJp } from "@/components/EmailTemplateJp";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { data, recaptchaToken } = body;

		const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
		if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
			return new NextResponse(
				JSON.stringify({
					error: "セキュリティチェックに失敗しました。もう一度お試しください。",
				}),
				{ status: 400 }
			);
		}

		const validatedFields = japaneseFormSchema.safeParse(data);
		if (!validatedFields.success) {
			return new NextResponse(
				JSON.stringify({
					errors: validatedFields.error.flatten().fieldErrors,
				}),
				{ status: 400 }
			);
		}

		const existingUserEnglish = await db.englishForm.findUnique({
			where: { email: validatedFields.data.email },
		});

		const existingUserJapanese = await db.japaneseForm.findUnique({
			where: { email: validatedFields.data.email },
		});

		if (existingUserEnglish || existingUserJapanese) {
			return new NextResponse(
				JSON.stringify({
					error: "このメールアドレスは既に登録されています",
				}),
				{ status: 400 }
			);
		}

		const registration = await db.japaneseForm.create({
			data: validatedFields.data,
		});

		const updatedRegistration = await db.japaneseForm.update({
			where: { id: registration.id },
			data: {
				referenceNumber: `J${registration.incrementId
					.toString()
					.padStart(4, "0")}`,
			},
		});

		try {
			const emailContent = generateEmailContentJp(updatedRegistration);
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
				await db.japaneseForm.delete({
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
					error: "メール送信に失敗しました。しばらくしてからもう一度お試しください。",
				}),
				{ status: 500 }
			);
		}

		return new NextResponse(
			JSON.stringify({
				message: "登録が完了しました",
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
			JSON.stringify({ error: "内部サーバーエラー" }),
			{ status: 500 }
		);
	}
}
