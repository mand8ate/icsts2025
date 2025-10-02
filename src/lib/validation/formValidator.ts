import { z } from "zod";

export const englishFormSchema = z
	.object({
		title: z
			.string()
			.min(1, "Title is required")
			.max(50, "Title must be less than 50 characters")
			.optional()
			.nullable(),
		otherTitle: z
			.string()
			.min(1, "Type the other title")
			.max(50, "Title must be less than 50 characters")
			.optional()
			.nullable(),
		firstName: z
			.string()
			.min(1, "First name is required")
			.max(50, "First name must be less than 50 characters"),
		lastName: z
			.string()
			.min(1, "Last name is required")
			.max(50, "Last name must be less than 50 characters"),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Invalid email format")
			.max(100, "Email must be less than 100 characters"),
		phone: z
			.string()
			.min(1, "Phone number is required")
			.max(20, "Phone number must be less than 20 characters"),
		country: z
			.string()
			.min(1, "Country is required")
			.max(100, "Country must be less than 100 characters"),
		affiliation: z
			.string()
			.max(100, "Affiliation must be less than 100 characters")
			.optional()
			.nullable(),
		position: z
			.string()
			.max(50, "Position must be less than 50 characters")
			.optional()
			.nullable(),
		reasonsForConference: z
			.array(z.string())
			.min(1, "Please select at least one option"),
		questionsForPanelists: z
			.string()
			.max(500, "Questions must be less than 500 characters")
			.optional()
			.nullable(),
		bringChildren: z.boolean(),
		numberOfChildren: z.number().nullable(),
		requiresNursing: z.boolean(),
		consentToChildcarePolicy: z
			.boolean()
			.refine((value) => value === true, {
				message: "You must accept the childcare policy",
			}),
		consentToPrivacyPolicy: z.boolean().refine((value) => value === true, {
			message: "You must accept the privacy policy to register",
		}),
	})
	.refine(
		(data) => {
			const requiredFields = {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				country: data.country,
				requiresNursing: data.requiresNursing,
			};
			return Object.values(requiredFields).every(
				(value) => value !== undefined && value !== null && value !== ""
			);
		},
		{
			message: "Please fill in all required fields",
		}
	)
	.refine(
		(data) => {
			if (data.bringChildren === true) {
				return (
					data.numberOfChildren !== null &&
					data.numberOfChildren > 0 &&
					data.numberOfChildren <= 10
				);
			}
			return true;
		},
		{
			message: "Please select a valid number of children (1-5)",
			path: ["numberOfChildren"],
		}
	);

export type EnglishFormData = z.infer<typeof englishFormSchema>;
