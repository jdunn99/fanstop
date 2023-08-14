import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions, type AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../lib/db";
import * as argon2 from "argon2";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    secret: "JECKASDLJHIUAHSDIUHASIDUHASKJDHAKSJH",

    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: {
                    label: "Password",
                    type: "text",
                    placeholder: "password",
                },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const { email, password } = credentials;
                if (!email || !password) return null;

                const user = await db.user.findUnique({ where: { email } });
                if (!user) return null;

                const { password: hashed } = user;
                if (!hashed) return null; // User has not set a password.

                if (await argon2.verify(hashed, password)) return user;

                return null;
            },
        }),
        // ...add more providers here
    ],
    adapter: PrismaAdapter(db),
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }

            return session;
        },
        async jwt({ token, user }) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email,
                },
            });

            if (!dbUser) {
                if (user) {
                    token.id = user?.id;
                }
                return token;
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
            };
        },
    },
};
export default NextAuth(authOptions);
