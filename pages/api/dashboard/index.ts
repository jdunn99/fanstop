import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getPostsByAuthor } from "../posts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });
        if (session === null) throw new Error("Unauthenticated");

        const recentPosts = await getPostsByAuthor({ userId: session.user.id, limit: 3 });

        res.status(200).json({
            recentPosts,
        })
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
}