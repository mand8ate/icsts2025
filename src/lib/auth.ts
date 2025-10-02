import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) {
					return null;
				}

				const isValid =
					credentials.username === process.env.ADMIN_USERNAME &&
					credentials.password === process.env.ADMIN_PASSWORD;

				if (isValid) {
					return {
						id: "1",
						name: "Admin",
					};
				}

				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token }) {
			return token;
		},
		async session({ session }) {
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};
export const getAuthSession = () => getServerSession(authOptions);
