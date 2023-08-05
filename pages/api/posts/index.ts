import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";


type PostParams = {
    userId: string;
    limit?: number;
}
/**
 * Fetches the posts made by a User.
 * @param userId - The ID of the User being queried.
 * @param limit - The number of posts for User.
 */
export async function getPostsByAuthor({ userId, limit }: PostParams) {
    return await db.post.findMany({ where: { authorId: { equals: userId } }, take: limit });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({ req })
    res.status(200).json(session);
}