// components/JapaneseFormsButton.tsx
"use client";

export default function JapaneseFormsButton() {
	const handleDownload = () => {
		window.location.href = "/api/forms/japaneseForms";
	};

	return (
		<button
			onClick={handleDownload}
			className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
		>
			Download Japanese Forms
		</button>
	);
}
