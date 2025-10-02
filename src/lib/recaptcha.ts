interface RecaptchaVerifyResponse {
	success: boolean;
	score: number;
	action: string;
	challenge_ts: string;
	hostname: string;
	error?: string[];
}

export async function verifyRecaptchaToken(token: string) {
	try {
		const response = await fetch(
			`https://www.google.com/recaptcha/api/siteverify`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
			}
		);

		const data: RecaptchaVerifyResponse = await response.json();

		return {
			success: data.success,
			score: data.score,
			action: data.action,
		};
	} catch (error) {
		console.error("Failed to verify reCAPTCHA:", error);
		return {
			success: false,
			score: 0,
			action: "",
		};
	}
}
