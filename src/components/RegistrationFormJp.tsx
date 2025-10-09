"use client";

import {
	japaneseFormSchema,
	JapaneseFormData,
} from "@/lib/validation/formValidatorJp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { reasonsForConferenceJp } from "@/constants/consts";
import { Check } from "lucide-react";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "./ui/radio-group";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	GoogleReCaptchaProvider,
	useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

interface RegistrationFormWithReCaptureProps {
	isChildcareCapacityReached: boolean;
}

function RegistrationFormWithReCapture({
	isChildcareCapacityReached,
}: RegistrationFormWithReCaptureProps) {
	const { executeRecaptcha } = useGoogleReCaptcha();
	const router = useRouter();
	const { toast } = useToast();
	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<JapaneseFormData>({
		resolver: zodResolver(japaneseFormSchema),
		defaultValues: {
			fullName: "",
			furigana: "",
			email: "",
			phone: "",
			attendanceDays: [],
			country: "",
			affiliation: "",
			position: "",
			reasonsForConference: [],
			questionsForPanelists: "",
			bringChildren: false,
			numberOfChildren: null,
			requiresNursing: false,
			consentToChildcarePolicy: false,
			consentToPrivacyPolicy: false,
		},
	});

	const watchedBringChildren = watch("bringChildren");
	useEffect(() => {
		if (watchedBringChildren !== true) {
			setValue("numberOfChildren", null);
		}
	}, [watchedBringChildren, setValue]);

	const getInputErrorClass = (error: boolean) =>
		error ? "border-red-500 focus:border-red-500" : "";

	const onSubmit = async (data: JapaneseFormData) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (!executeRecaptcha) {
			return toast({
				title: "エラー",
				description: "ReCaptchaの準備ができていません",
				variant: "destructive",
			});
		}

		try {
			const token = await executeRecaptcha("submit_registration");
			const response = await fetch("/api/registerjp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data, recaptchaToken: token }),
			});

			if (!response.ok) {
				const result = await response.json();
				return toast({
					title: "エラー",
					description: result.error,
					variant: "destructive",
				});
			}

			toast({
				title: "登録完了",
				description: "登録確認メールをご確認ください",
			});

			router.push("/thanks");
		} catch (error) {
			console.error("Registration error:", error);
			toast({
				title: "サーバーエラー",
				description:
					"内部エラーが発生しました。後でもう一度お試しください",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-8">
			<div className="w-full max-w-2xl">
				<Card className="bg-white shadow-sm">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							持続可能な社会のための科学と技術に関する国際会議2025{" "}
							<br />
							参加登録フォーム
						</CardTitle>
						<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
							<p className="text-sm text-yellow-800">
								<strong>重要：</strong>登録を開始する前に{" "}
								<Link
									href="/privacy-policy/?lang=jp"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline font-semibold"
								>
									プライバシーポリシー
								</Link>{" "}
								をご確認ください。このページを離れると入力データは保存されません。
								1回の操作で登録を完了してください。
							</p>
						</div>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<div className="grid gap-6">
								<fieldset
									disabled={isSubmitting}
									className={`grid gap-6 ${
										isSubmitting ? "opacity-60" : ""
									}`}
								>
									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="fullName">
												氏名＊
											</Label>
											<p className="text-sm text-muted-foreground">
												姓と名の間に全角スペースを入れてください
												<br />
												<span className="text-gray-500">
													（記入例：学術 太郎）
												</span>
											</p>
										</div>
										<Input
											id="fullName"
											type="text"
											className={getInputErrorClass(
												!!errors.fullName
											)}
											{...register("fullName")}
										/>
										{errors.fullName && (
											<p className="text-sm text-red-500">
												{errors.fullName.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="furigana">
												フリガナ＊
											</Label>
											<p className="text-sm text-muted-foreground">
												姓と名の間に全角スペースを入れてください
												<br />
												<span className="text-gray-500">
													（記入例：ガクジュツ
													タロウ）
												</span>
											</p>
										</div>
										<Input
											id="furigana"
											type="text"
											className={getInputErrorClass(
												!!errors.furigana
											)}
											{...register("furigana")}
										/>
										{errors.furigana && (
											<p className="text-sm text-red-500">
												{errors.furigana.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="affiliation">
												所属機関
											</Label>
											<p className="text-sm text-muted-foreground">
												現在の所属機関を入力してください
											</p>
										</div>
										<Input
											id="affiliation"
											type="text"
											{...register("affiliation")}
										/>
										{errors.affiliation && (
											<p className="text-sm text-red-500">
												{errors.affiliation.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="position">
												役職
											</Label>
											<p className="text-sm text-muted-foreground">
												現在の役職を入力してください
											</p>
										</div>
										<Input
											id="position"
											type="text"
											{...register("position")}
										/>
										{errors.position && (
											<p className="text-sm text-red-500">
												{errors.position.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="country">
												国＊
											</Label>
											<p className="text-sm text-muted-foreground">
												お住まいの国を入力してください
											</p>
										</div>
										<Input
											id="country"
											type="text"
											className={getInputErrorClass(
												!!errors.country
											)}
											{...register("country")}
										/>
										{errors.country && (
											<p className="text-sm text-red-500">
												{errors.country.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="email">
												メールアドレス＊
											</Label>
											<p className="text-sm text-muted-foreground">
												会議に関する連絡に使用するメールアドレスを入力してください
											</p>
										</div>
										<Input
											id="email"
											type="email"
											className={getInputErrorClass(
												!!errors.email
											)}
											{...register("email")}
										/>
										{errors.email && (
											<p className="text-sm text-red-500">
												{errors.email.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="phone">
												電話番号＊
											</Label>
											<p className="text-sm text-muted-foreground">
												国番号を含む電話番号を入力してください（例：080-1234-5678）
											</p>
										</div>
										<Input
											id="phone"
											type="text"
											className={getInputErrorClass(
												!!errors.phone
											)}
											{...register("phone")}
										/>
										{errors.phone && (
											<p className="text-sm text-red-500">
												{errors.phone.message}
											</p>
										)}
									</div>

									{/* Attendance Days - Now positioned after phone number */}
									<div className="space-y-2">
										<div className="space-y-1">
											<Label>
												参加を希望する日にち＊
											</Label>
											<p className="text-sm text-muted-foreground">
												参加する日を選択してください（複数選択可）
											</p>
										</div>
										<Controller
											name="attendanceDays"
											control={control}
											render={({ field }) => (
												<div className="space-y-2">
													{["2月11日", "2月12日"].map(
														(day) => (
															<div
																key={day}
																className="flex items-center space-x-2"
															>
																<div className="relative">
																	<input
																		type="checkbox"
																		id={day}
																		checked={field.value.includes(
																			day
																		)}
																		onChange={() => {
																			const newValue =
																				field.value.includes(
																					day
																				)
																					? field.value.filter(
																							(
																								item
																							) =>
																								item !==
																								day
																					  )
																					: [
																							...field.value,
																							day,
																					  ];
																			field.onChange(
																				newValue
																			);
																		}}
																		className="appearance-none h-4 w-4 border border-primary rounded-sm bg-white checked:bg-primary checked:border-primary flex items-center justify-center focus:ring-2 focus:ring-ring focus:ring-offset-2"
																	/>
																	<Check
																		className={`h-4 w-4 text-white absolute top-0 left-0 pointer-events-none ${
																			field.value.includes(
																				day
																			)
																				? "block"
																				: "hidden"
																		}`}
																	/>
																</div>
																<label
																	htmlFor={
																		day
																	}
																	className="text-sm font-normal"
																>
																	{day}
																</label>
															</div>
														)
													)}
												</div>
											)}
										/>
										{errors.attendanceDays && (
											<p className="text-sm text-red-500 mt-1.5">
												{errors.attendanceDays.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label>本会議を知った理由＊</Label>
											<p className="text-sm text-muted-foreground">
												該当するものをすべて選択してください
											</p>
										</div>
										<Controller
											name="reasonsForConference"
											control={control}
											render={({ field }) => (
												<div className="space-y-2">
													{reasonsForConferenceJp.map(
														(reason) => (
															<div
																key={reason}
																className="flex items-center space-x-2"
															>
																<div className="relative">
																	<input
																		type="checkbox"
																		id={
																			reason
																		}
																		checked={field.value.includes(
																			reason
																		)}
																		onChange={() => {
																			const newValue =
																				field.value.includes(
																					reason
																				)
																					? field.value.filter(
																							(
																								item
																							) =>
																								item !==
																								reason
																					  )
																					: [
																							...field.value,
																							reason,
																					  ];
																			field.onChange(
																				newValue
																			);
																		}}
																		className="appearance-none h-4 w-4 border border-primary rounded-sm bg-white checked:bg-primary checked:border-primary flex items-center justify-center focus:ring-2 focus:ring-ring focus:ring-offset-2"
																	/>
																	<Check
																		className={`h-4 w-4 text-white absolute top-0 left-0 pointer-events-none ${
																			field.value.includes(
																				reason
																			)
																				? "block"
																				: "hidden"
																		}`}
																	/>
																</div>
																<label
																	htmlFor={
																		reason
																	}
																	className="text-sm font-normal"
																>
																	{reason}
																</label>
															</div>
														)
													)}
												</div>
											)}
										/>
										{errors.reasonsForConference && (
											<p className="text-sm text-red-500 mt-1.5">
												{
													errors.reasonsForConference
														.message
												}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="questionsForPanelists">
												パネリストへの質問
											</Label>
											<p className="text-sm text-muted-foreground">
												会議で取り上げてもらいたい質問があれば記入ください
											</p>
										</div>
										<textarea
											id="questionsForPanelists"
											{...register(
												"questionsForPanelists"
											)}
											className={`w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background ${
												errors.questionsForPanelists
													? "border-red-500"
													: ""
											}`}
										/>
										{errors.questionsForPanelists && (
											<p className="text-sm text-red-500">
												{
													errors.questionsForPanelists
														.message
												}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="bringChildren">
												お子様の同伴希望（保護者同伴であれば、託児所利用の有無に関わらず参加可能です）＊
											</Label>
										</div>
										<Controller
											name="bringChildren"
											control={control}
											defaultValue={false}
											render={({ field }) => (
												<RadioGroup
													onValueChange={(value) => {
														field.onChange(
															value === "true"
														);
														if (value === "false") {
															setValue(
																"numberOfChildren",
																null
															);
														}
													}}
													value={field.value.toString()}
													className="flex space-x-4"
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="false"
															id="bringChildrenNo"
														/>
														<Label htmlFor="bringChildrenNo">
															いいえ
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="true"
															id="bringChildrenYes"
														/>
														<Label htmlFor="bringChildrenYes">
															はい
														</Label>
													</div>
												</RadioGroup>
											)}
										/>

										{watch("bringChildren") && (
											<div className="mt-4">
												<Controller
													name="numberOfChildren"
													control={control}
													render={({ field }) => (
														<Select
															onValueChange={(
																value
															) =>
																field.onChange(
																	parseInt(
																		value
																	)
																)
															}
															value={
																field.value?.toString() ||
																""
															}
														>
															<SelectTrigger
																className={
																	errors.numberOfChildren
																		? "border-red-500"
																		: ""
																}
															>
																<SelectValue placeholder="お子様の人数を選択してください" />
															</SelectTrigger>
															<SelectContent>
																{[
																	1, 2, 3, 4,
																	5,
																].map((num) => (
																	<SelectItem
																		key={
																			num
																		}
																		value={num.toString()}
																	>
																		{num}名
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>
												{errors.numberOfChildren && (
													<p className="text-sm text-red-500">
														{
															errors
																.numberOfChildren
																.message
														}
													</p>
												)}
											</div>
										)}
									</div>

									{!isChildcareCapacityReached && (
										<div className="space-y-2">
											<div className="space-y-1">
												<Label htmlFor="requiresNursing">
													託児所の利用希望（先着順）＊
												</Label>
												<p className="text-sm text-muted-foreground">
													会議中の託児所利用を希望される場合は「はい」を選択してください
												</p>
												<Controller
													name="requiresNursing"
													control={control}
													defaultValue={false}
													render={({ field }) => (
														<RadioGroup
															onValueChange={(
																value
															) =>
																field.onChange(
																	value ===
																		"true"
																)
															}
															value={field.value.toString()}
															className="flex space-x-4"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="false"
																	id="no"
																/>
																<Label htmlFor="no">
																	いいえ
																</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="true"
																	id="yes"
																/>
																<Label htmlFor="yes">
																	はい
																</Label>
															</div>
														</RadioGroup>
													)}
												/>
											</div>
										</div>
									)}

									{/* Show childcare policy when bringing children OR using nursing */}
									{(watch("bringChildren") ||
										watch("requiresNursing")) && (
										<div className="space-y-2">
											<div className="flex items-start space-x-2">
												<div className="relative pt-1">
													<input
														type="checkbox"
														id="consentToChildcarePolicy"
														{...register(
															"consentToChildcarePolicy"
														)}
														className="appearance-none h-4 w-4 border border-primary rounded-sm bg-white checked:bg-primary checked:border-primary flex items-center justify-center focus:ring-2 focus:ring-ring focus:ring-offset-2"
													/>
													<Check
														className={`h-4 w-4 text-white absolute top-1 left-0 pointer-events-none ${
															watch(
																"consentToChildcarePolicy"
															)
																? "block"
																: "hidden"
														}`}
													/>
												</div>
												<label
													htmlFor="consentToChildcarePolicy"
													className="text-sm text-gray-600"
												>
													12歳以下のお子様を同伴する場合は、私（保護者）が同伴し、監督責任を負うことに同意します。託児サービスに申し込む場合は、託児利用規約を確認し、了承の上、申込を行います。＊
												</label>
											</div>
											{errors.consentToChildcarePolicy && (
												<p className="text-sm text-red-500">
													{
														errors
															.consentToChildcarePolicy
															.message
													}
												</p>
											)}
										</div>
									)}

									<div className="space-y-2">
										<div className="flex items-start space-x-2">
											<div className="relative pt-1">
												<input
													type="checkbox"
													id="consentToPrivacyPolicy"
													{...register(
														"consentToPrivacyPolicy"
													)}
													className="appearance-none h-4 w-4 border border-primary rounded-sm bg-white checked:bg-primary checked:border-primary flex items-center justify-center focus:ring-2 focus:ring-ring focus:ring-offset-2"
												/>
												<Check
													className={`h-4 w-4 text-white absolute top-1 left-0 pointer-events-none ${
														watch(
															"consentToPrivacyPolicy"
														)
															? "block"
															: "hidden"
													}`}
												/>
											</div>
											<label
												htmlFor="consentToPrivacyPolicy"
												className="text-sm text-gray-600"
											>
												<Link
													href="/privacy-policy/?lang=jp"
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													プライバシーポリシー
												</Link>
												を読み、同意します。このフォームを送信することで、プライバシーポリシーに記載されている通り、私の個人データの処理に同意します。＊
											</label>
										</div>
										{errors.consentToPrivacyPolicy && (
											<p className="text-sm text-red-500">
												{
													errors
														.consentToPrivacyPolicy
														.message
												}
											</p>
										)}
									</div>

									<div className="pt-4">
										<Button
											type="submit"
											className="w-full relative"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<>
													<span className="opacity-0">
														登録する
													</span>
													<div className="absolute inset-0 flex items-center justify-center">
														<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
													</div>
												</>
											) : (
												"登録する"
											)}
										</Button>
									</div>
								</fieldset>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

interface RegistrationFormProps {
	isChildcareCapacityReached: boolean;
}

export default function JapaneseRegistrationForm({
	isChildcareCapacityReached,
}: RegistrationFormProps) {
	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
			scriptProps={{
				async: false,
				defer: false,
				appendTo: "head",
				nonce: undefined,
			}}
		>
			<RegistrationFormWithReCapture
				isChildcareCapacityReached={isChildcareCapacityReached}
			/>
		</GoogleReCaptchaProvider>
	);
}
