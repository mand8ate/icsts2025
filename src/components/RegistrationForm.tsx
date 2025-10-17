"use client";

import {
	englishFormSchema,
	EnglishFormData,
} from "@/lib/validation/formValidator";
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
import { titles, reasonsForConference } from "@/constants/consts";
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
	} = useForm<EnglishFormData>({
		resolver: zodResolver(englishFormSchema),
		defaultValues: {
			title: undefined,
			otherTitle: undefined,
			firstName: "",
			lastName: "",
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

	const watchedTitle = watch("title");
	useEffect(() => {
		if (watchedTitle !== "Other") {
			setValue("otherTitle", undefined);
		}
	}, [watchedTitle, setValue]);

	const watchedBringChildren = watch("bringChildren");
	useEffect(() => {
		if (watchedBringChildren !== true) {
			setValue("numberOfChildren", null);
		}
	}, [watchedBringChildren, setValue]);

	const getInputErrorClass = (error: boolean) =>
		error ? "border-red-500 focus:border-red-500" : "";

	const onSubmit = async (data: EnglishFormData) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (!executeRecaptcha) {
			return toast({
				title: "Problem",
				description: "ReCaptcha not ready yet",
				variant: "destructive",
			});
		}

		try {
			const token = await executeRecaptcha("submit_registration");
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data, recaptchaToken: token }),
			});

			if (!response.ok) {
				const result = await response.json();
				return toast({
					title: "Problem",
					description: result.error,
					variant: "destructive",
				});
			}

			toast({
				title: "Registration Successful",
				description: "Check your registered email for the details",
			});

			router.push("/thanks");
		} catch (error) {
			console.error("Registration error:", error);
			toast({
				title: "Server Error",
				description: "Internal Error, try again later",
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
							International Conference on Science and Technology
							for Sustainability 2025 <br />
							Conference Registration Form
						</CardTitle>
						<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
							<p className="text-sm text-yellow-800">
								<strong>Important:</strong> Please review our{" "}
								<Link
									href="/privacy-policy"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline font-semibold"
								>
									privacy policy
								</Link>{" "}
								before starting your registration. Form data
								will not be saved if you leave this page.
								Complete the registration in one session.
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
											<Label htmlFor="title">Title</Label>
											<p className="text-sm text-muted-foreground">
												Select your preferred title
											</p>
										</div>
										<Controller
											name="title"
											control={control}
											render={({ field }) => (
												<>
													<Select
														onValueChange={
															field.onChange
														}
													>
														<SelectTrigger
															className={
																errors.title
																	? "border-red-500"
																	: ""
															}
														>
															<SelectValue placeholder="Mr. / Ms. / Prof. / Dr. / Other" />
														</SelectTrigger>
														<SelectContent>
															{titles.map(
																(title) => (
																	<SelectItem
																		key={
																			title
																		}
																		value={
																			title
																		}
																	>
																		{title}
																	</SelectItem>
																)
															)}
														</SelectContent>
													</Select>
												</>
											)}
										/>
										{errors.title && (
											<p className="text-sm text-red-500">
												{errors.title.message}
											</p>
										)}

										{watch("title") === "Other" && (
											<div className="mt-2">
												<div className="space-y-1">
													<Label htmlFor="otherTitle">
														Other Title
													</Label>
													<p className="text-sm text-muted-foreground">
														Please specify your
														preferred title
													</p>
												</div>
												<Input
													id="otherTitle"
													{...register("otherTitle")}
													className={getInputErrorClass(
														!!errors.otherTitle
													)}
												/>
												{errors.otherTitle && (
													<p className="text-sm text-red-500">
														{
															errors.otherTitle
																.message
														}
													</p>
												)}
											</div>
										)}
									</div>
									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="firstName">
												First Name*
											</Label>
											<p className="text-sm text-muted-foreground">
												Enter your first name
											</p>
										</div>
										<Input
											id="firstName"
											type="text"
											className={getInputErrorClass(
												!!errors.firstName
											)}
											{...register("firstName")}
										/>
										{errors.firstName && (
											<p className="text-sm text-red-500">
												{errors.firstName.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="lastName">
												Last Name*
											</Label>
											<p className="text-sm text-muted-foreground">
												Enter your last name
											</p>
										</div>
										<Input
											id="lastName"
											type="text"
											className={getInputErrorClass(
												!!errors.lastName
											)}
											{...register("lastName")}
										/>
										{errors.lastName && (
											<p className="text-sm text-red-500">
												{errors.lastName.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="affiliation">
												Affiliation
											</Label>
											<p className="text-sm text-muted-foreground">
												Your current affiliated
												institution
											</p>
										</div>
										<Input
											id="affilitation"
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
												Position
											</Label>
											<p className="text-sm text-muted-foreground">
												Your current role at your
												institution
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
												Country*
											</Label>
											<p className="text-sm text-muted-foreground">
												Your country of residence
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
												Contact Information (email)*
											</Label>
											<p className="text-sm text-muted-foreground">
												Your primary email address for
												conference communications
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
												Contact Information (phone)*
											</Label>
											<p className="text-sm text-muted-foreground">
												Your phone number including
												country code (e.g. +1 for USA)
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
												Which days will you attend?* (Partial attendance acceptable)
											</Label>
											<p className="text-sm text-muted-foreground">
												Select all days you plan to
												attend
											</p>
										</div>
										<Controller
											name="attendanceDays"
											control={control}
											render={({ field }) => (
												<div className="space-y-2">
													{[
														"February 11",
														"February 12",
													].map((day) => (
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
																htmlFor={day}
																className="text-sm font-normal"
															>
																{day}
															</label>
														</div>
													))}
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
											<Label>
												How did you find out about this
												conference? *
											</Label>
											<p className="text-sm text-muted-foreground">
												Select all that apply
											</p>
										</div>
										<Controller
											name="reasonsForConference"
											control={control}
											render={({ field }) => (
												<div className="space-y-2">
													{reasonsForConference.map(
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
												Questions for Panelists (Within 250 words)
											</Label>
											<p className="text-sm text-muted-foreground">
												Please enter any questions you
												would like to be addressed
												during the conference.
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
												Will you bring children to the
												conference? (Children may attend
												with parental supervision, even
												without using the nursery
												facilities)*
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
															No
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="true"
															id="bringChildrenYes"
														/>
														<Label htmlFor="bringChildrenYes">
															Yes
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
																<SelectValue placeholder="Select number of children" />
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
																		{num}
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
													Do you require the use of a
													nursery?* (Limited Availability)
												</Label>
												<p className="text-sm text-muted-foreground">
													Select yes if you need
													access to nursing facilities
													during the conference
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
																	No
																</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="true"
																	id="yes"
																/>
																<Label htmlFor="yes">
																	Yes
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
											<p className="text-sm text-gray-700">
											Please agree to the following conditions to use the nursery.
											</p>
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
													If I am accompanied by a
													child under 12 years of age,
													I, a parent or guardian,
													agree to be responsible for
													the supervision of the
													child. If I apply for
													childcare services, I
													confirm the
													&quot;Information on
													Nursery&quot; and agree to
													the terms of use.*
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
										<p className="text-sm text-gray-700">
										Please review the following and agree before submitting the form.
										</p>
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
												I acknowledge that I have read
												and agree to the{" "}
												<Link
													href="/privacy-policy/?lang=en"
													className="text-primary hover:underline"
													target="_blank"
												>
													privacy policy
												</Link>
												. By submitting this form, I
												consent to the processing of my
												personal data as described in
												the privacy policy.*
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
														Register
													</span>
													<div className="absolute inset-0 flex items-center justify-center">
														<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
													</div>
												</>
											) : (
												"Register"
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

export default function RegistrationForm({
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
