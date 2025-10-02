"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EnglishPolicy, JapanesePolicy } from "@/components/PrivacyPolicy";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

function PrivacyPolicyContent() {
	const { language, setLanguage } = useLanguage();
	const searchParams = useSearchParams();

	useEffect(() => {
		const urlLang = searchParams.get("lang");
		if (urlLang === "jp") {
			setLanguage("jp");
		} else if (!urlLang) {
			setLanguage("en");
		}
	}, [searchParams, setLanguage]);

	const title = language === "en" ? "Privacy Policy" : "プライバシーポリシー";

	return (
		<div className="py-8">
			<Card className="bg-white shadow-sm">
				<CardContent className="p-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-8">
						{title}
					</h1>
					{language === "en" ? <EnglishPolicy /> : <JapanesePolicy />}
				</CardContent>
			</Card>
		</div>
	);
}

export default function PrivacyPolicy() {
	return (
		<Suspense>
			<PrivacyPolicyContent />
		</Suspense>
	);
}
