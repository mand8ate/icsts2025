"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RegistrationForm from "@/components/RegistrationForm";
import RegistrationFormJp from "@/components/RegistrationFormJp";
import { useLanguage } from "@/context/LanguageContext";

interface HomeContentProps {
	isChildcareCapacityReached: boolean;
}

function HomeContent({ isChildcareCapacityReached }: HomeContentProps) {
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

	return (
		<div className="container">
			{language === "en" ? (
				<RegistrationForm
					isChildcareCapacityReached={isChildcareCapacityReached}
				/>
			) : (
				<RegistrationFormJp
					isChildcareCapacityReached={isChildcareCapacityReached}
				/>
			)}
		</div>
	);
}

interface TopPageProps {
	isChildcareCapacityReached: boolean;
}

export default function TopPage({ isChildcareCapacityReached }: TopPageProps) {
	return (
		<Suspense>
			<HomeContent
				isChildcareCapacityReached={isChildcareCapacityReached}
			/>
		</Suspense>
	);
}
