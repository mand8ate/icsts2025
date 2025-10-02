"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
	const { language, setLanguage } = useLanguage();
	const router = useRouter();
	const pathname = usePathname();

	const handleLanguageSwitch = () => {
		const newLang = language === "en" ? "jp" : "en";
		setLanguage(newLang);

		if (newLang === "jp") {
			router.push(`${pathname}?lang=jp`);
		} else {
			router.push(pathname);
		}
	};

	const translations = {
		en: {
			registration: "Registration Form",
		},
		jp: {
			registration: "登録フォーム",
		},
	};

	return (
		<div className="flex justify-between items-center fixed w-full bg-gray-400 px-4 py-2 z-10">
			<div>
				<nav>
					<Link href={language === "en" ? "/" : "/?lang=jp"}>
						<Button variant="outline">
							{translations[language].registration}
						</Button>
					</Link>
				</nav>
			</div>
			<div>
				<nav>
					<Button onClick={handleLanguageSwitch}>
						{language === "en" ? "日本語" : "English"}
					</Button>
				</nav>
			</div>
		</div>
	);
}
