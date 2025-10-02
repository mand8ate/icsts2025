import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
	title: `International Conference on Science and Technology for Sustainability 2024
Conference Registration Form`,
	description: "Register for the conference",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${GeistSans.variable} ${GeistMono.variable}`}>
				<LanguageProvider>
					<Navbar />
					<main className="flex justify-center items-center pt-12 min-h-screen">
						{children}
					</main>
					<Toaster />
					<Footer />
				</LanguageProvider>
			</body>
		</html>
	);
}
