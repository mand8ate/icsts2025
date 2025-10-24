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
		middleName: z
			.string()
			.max(50, "Middle name must be less than 50 characters")
			.optional()
			.nullable(),
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
		attendanceDays: z
			.array(z.string())
			.min(1, "Please select at least one attendance day"),
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
			.refine(
				(value) => {
					// Skip check if empty
					if (!value) return true;
					// Count words (splitting by whitespace)
					const wordCount = value.trim().split(/\s+/).length;
					return wordCount <= 250;
				},
				{
					message: "Questions must be less than 250 words",
				}
			)
			.optional()
			.nullable(),
		bringChildren: z.boolean(),
		numberOfChildren: z.number().nullable(),
		requiresNursing: z.boolean(),
		consentToChildcarePolicy: z.boolean(),
		consentToChildcareFacilityPolicy: z.boolean(),
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
				attendanceDays: data.attendanceDays,
				country: data.country,
				requiresNursing: data.requiresNursing,
			};
			return Object.values(requiredFields).every(
				(value) =>
					value !== undefined &&
					value !== null &&
					value !== "" &&
					!(Array.isArray(value) && value.length === 0)
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
	)
	.refine(
		(data) => {
			// Require childcare policy consent if bringing children OR using nursing facilities
			if (data.bringChildren === true || data.requiresNursing === true) {
				return data.consentToChildcarePolicy === true;
			}
			return true;
		},
		{
			message:
				"You must accept the childcare policy when bringing children or using nursing facilities",
			path: ["consentToChildcarePolicy"],
		}
	)
	.refine(
		(data) => {
			// Require childcare facility policy consent only if using nursing facilities
			if (data.requiresNursing === true) {
				return data.consentToChildcareFacilityPolicy === true;
			}
			return true;
		},
		{
			message: "You must review and accept the childcare facility terms",
			path: ["consentToChildcareFacilityPolicy"],
		}
	);

export type EnglishFormData = z.infer<typeof englishFormSchema>;
