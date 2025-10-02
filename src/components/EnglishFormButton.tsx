// components/EnglishFormsButton.tsx
"use client";

export default function EnglishFormsButton() {
	const handleDownload = () => {
		window.location.href = "/api/forms/englishForms";
	};

	return (
		<button
			onClick={handleDownload}
			className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
		>
			Download English Forms
		</button>
	);
}
