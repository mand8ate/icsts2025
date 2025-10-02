import LogoutButton from "@/components/LogoutButton";
import EnglishFormsButton from "@/components/EnglishFormButton";
import JapaneseFormsButton from "@/components/JapaneseFormButton";
import ChildcareCapacityToggler from "@/components/ChildcareCapacityToggler";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function AdminPage() {
	const session = await getAuthSession();
	if (!session) {
		redirect("/login");
	}

	const japaneseFormCount = await db.japaneseForm.count();
	const englishFormCount = await db.englishForm.count();
	const totalSubmissions = japaneseFormCount + englishFormCount;

	const japaneseNursingCount = await db.japaneseForm.count({
		where: { requiresNursing: true },
	});
	const englishNursingCount = await db.englishForm.count({
		where: { requiresNursing: true },
	});
	const totalNursingRequests = japaneseNursingCount + englishNursingCount;

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="mb-12">
				<h1 className="text-3xl font-bold text-center mb-8">
					Admin Dashboard
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-500 mb-2">
							Japanese Forms
						</h3>
						<p className="text-3xl font-bold">
							{japaneseFormCount}
						</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-500 mb-2">
							English Forms
						</h3>
						<p className="text-3xl font-bold">{englishFormCount}</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-500 mb-2">
							Total Submissions
						</h3>
						<p className="text-3xl font-bold">{totalSubmissions}</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-500 mb-2">
							Nursery Requests
						</h3>
						<p className="text-3xl font-bold">
							{totalNursingRequests}
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-8">
				<div className="border-t pt-8">
					<h2 className="text-2xl font-semibold mb-6">
						Childcare Management
					</h2>
					<ChildcareCapacityToggler />
				</div>

				<div className="border-t pt-8">
					<h2 className="text-2xl font-semibold mb-6">
						Download Forms
					</h2>
					<div className="flex gap-4">
						<JapaneseFormsButton />
						<EnglishFormsButton />
					</div>
				</div>

				<div className="border-t pt-8">
					<h2 className="text-2xl font-semibold mb-6">
						Admin Actions
					</h2>
					<LogoutButton />
				</div>
			</div>
		</div>
	);
}
