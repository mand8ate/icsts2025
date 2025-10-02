"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
	const { language } = useLanguage();

	return (
		<div className="flex justify-center items-center py-12 px-10 bg-gray-400">
			<div>
				<Link href="privacy-policy">
					<Button>
						{language === "en"
							? "Privacy Policy"
							: "プライバシーポリシー"}
					</Button>
				</Link>
			</div>
		</div>
	);
}
