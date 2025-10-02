import LoginComponent from "@/components/LoginComponent";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await getAuthSession();

	if (session) {
		redirect("/");
	}

	return <LoginComponent />;
}
