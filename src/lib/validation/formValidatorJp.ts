import { z } from "zod";

export const japaneseFormSchema = z
	.object({
		fullName: z
			.string()
			.min(1, "姓を入力してください")
			.max(50, "姓は50文字以内で入力してください"),
		furigana: z
			.string()
			.min(1, "フリガナを入力してください")
			.max(50, "フリガナは50文字以内で入力してください"),
		email: z
			.string()
			.min(1, "メールアドレスが必要です")
			.email("有効なメールアドレスを入力してください")
			.max(100, "メールアドレスの文字数を超えました"),
		phone: z
			.string()
			.min(1, "電話番号を入力してください")
			.max(20, "電話番号は２０文字以内を入力してください"),
		country: z
			.string()
			.min(1, "国を選択してください")
			.max(100, "国名は100文字以内で入力してください"),
		affiliation: z
			.string()
			.max(100, "所属機関は100文字以内で入力してください")
			.optional()
			.nullable(),
		position: z
			.string()
			.max(50, "役職は50文字以内で入力してください")
			.optional()
			.nullable(),
		reasonsForConference: z
			.array(z.string())
			.min(1, "少なくとも一つの選択肢をお選びください"),
		questionsForPanelists: z
			.string()
			.max(500, "質問は500文字以内で入力してください")
			.optional()
			.nullable(),
		bringChildren: z.boolean(),
		numberOfChildren: z.number().nullable(),
		requiresNursing: z.boolean(),
		consentToChildcarePolicy: z
			.boolean()
			.refine((value) => value === true, {
				message: "保育に関する規約に同意する必要があります",
			}),
		consentToPrivacyPolicy: z.boolean().refine((value) => value === true, {
			message: "プライバシーポリシーに同意する必要があります",
		}),
	})
	.refine(
		(data) => {
			const requiredFields = {
				fullName: data.fullName,
				furigana: data.furigana,
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
			message: "全ての必須項目を入力してください",
		}
	)
	.refine(
		(data) => {
			if (data.bringChildren === true) {
				return (
					data.numberOfChildren !== null &&
					data.numberOfChildren > 0 &&
					data.numberOfChildren <= 5
				);
			}
			return true;
		},
		{
			message: "お子様の人数を1名から5名の間をお選びください",
			path: ["numberOfChildren"],
		}
	);

export type JapaneseFormData = z.infer<typeof japaneseFormSchema>;
