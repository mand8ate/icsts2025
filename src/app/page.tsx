import TopPage from "@/components/TopPage";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page() {
	// Create a formatter for Japan timezone
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});

	// Get current time in Japan
	const now = new Date();
	const [japanDate, japanTime] = formatter.format(now).split(", ");

	// Parse the deadline in Japan time
	const deadline = new Date("2025-01-30T12:00:00+09:00");
	const deadlineFormatted = formatter.format(deadline);

	// Compare the formatted strings directly
	const currentDateTime = `${japanDate}, ${japanTime}`;
	const isAfterDeadline = currentDateTime > deadlineFormatted;

	// Debug logging (you can remove this after confirming it works)
	console.log("Current Japan time:", currentDateTime);
	console.log("Deadline:", deadlineFormatted);
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
