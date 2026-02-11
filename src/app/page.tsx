import TopPage from "@/components/TopPage";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page() {
	// Get current time
	const now = new Date();

	// Convert to Japan timezone
	const japanTime = new Date(
		now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
	);

	// Deadline in Japan time (January 30, 2027, 12:00 PM JST)
	const deadline = new Date("2026-02-11T10:00:00");

	const isAfterDeadline = japanTime > deadline;

	// Debug logging
	console.log("Current Japan time:", japanTime);
	console.log("Deadline:", deadline);
	console.log("Is after deadline:", isAfterDeadline);

	if (isAfterDeadline) {
		return (
			<div className="text-center p-8">
				<p className="text-xl">
					参加登録は締め切りました。
					<br />
					Registration has been closed
				</p>
			</div>
		);
	}

	const capacityStatus = await db.childcareCapacity.findUnique({
		where: { id: 1 },
	});

	return (
		<TopPage
			isChildcareCapacityReached={capacityStatus?.reached ?? false}
		/>
	);
}
