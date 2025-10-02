"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
	const { language } = useLanguage();
	const thankYouMessage = {
		en: "Thank you for your registration",
		jp: "ご登録ありがとうございます",
	};

	const emailCheckMessage = {
		en: "Please check your email for registration details",
		jp: "登録確認メールをご確認ください",
	};

	const nurseryMessage = {
		en: "If you requested nursery services, please proceed with the application process described in the email",
		jp: "託児所利用希望の方は続いてメール記載の申込手続へお進みください",
	};

	return (
		<div className="min-h-screen flex flex-col w-full justify-center items-center gap-4">
			<h1 className="text-2xl font-bold">
				{language === "en" ? thankYouMessage.en : thankYouMessage.jp}
			</h1>
			<div className="flex flex-col items-center gap-4 text-center">
				<p className="text-gray-600">
					{language === "en"
						? emailCheckMessage.en
						: emailCheckMessage.jp}
				</p>
				<div className="border border-red-500 bg-red-50 rounded-md p-4 max-w-md">
					<p className="text-red-600 font-medium">
						{language === "en"
							? nurseryMessage.en
							: nurseryMessage.jp}
					</p>
				</div>
			</div>
		</div>
	);
}
