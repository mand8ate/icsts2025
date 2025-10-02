// components/ChildcareCapacityToggler.tsx
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function ChildcareCapacityToggler() {
	const capacityStatus = await db.childcareCapacity.findUnique({
		where: { id: 1 },
	});

	async function toggleCapacity() {
		"use server";

		await db.childcareCapacity.update({
			where: { id: 1 },
			data: { reached: !capacityStatus?.reached },
		});

		revalidatePath("/admin");
	}

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h3 className="text-lg font-medium text-gray-500 mb-4">
				Childcare Capacity Status
			</h3>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<div
						className={`w-3 h-3 rounded-full ${
							capacityStatus?.reached
								? "bg-red-500"
								: "bg-green-500"
						}`}
					/>
					<span className="text-sm font-medium">
						{capacityStatus?.reached
							? "Capacity Reached"
							: "Accepting Registrations"}
					</span>
				</div>
				<form action={toggleCapacity}>
					<Button
						variant={
							capacityStatus?.reached ? "destructive" : "default"
						}
					>
						{capacityStatus?.reached
							? "Open Registration"
							: "Set as Full"}
					</Button>
				</form>
			</div>
		</div>
	);
}
