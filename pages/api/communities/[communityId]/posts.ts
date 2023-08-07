import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const methods = ["GET", "POST"];
const QuerySchema = z.object({
    communityId: z.string().cuid(),
});

const PostInputSchema = z.object({
    authorId: z.string().cuid(),
    content: z.any(),
    title: z.string(),
});

type PostInput = z.infer<typeof PostInputSchema> & z.infer<typeof QuerySchema>;

async function getAllPostsForCommunity(communityId: string) {
    return await db.post.findMany({
        where: { communityId: { equals: communityId } },
    });
}

async function createPost({
    communityId,
    authorId,
    content,
    title,
}: PostInput) {
    return await db.post.create({
        data: {
            community: { connect: { id: communityId } },
            content,
            views: 0,
            title,
            author: { connect: { id: authorId } },
        },
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { method, query, body } = req;
        const { communityId } = QuerySchema.parse(query);

        if (!methods.includes(method!)) {
            return res.status(400).send({ message: "Invalid Method" });
        }

        if (method === "GET") {
            return res
                .status(200)
                .json(await getAllPostsForCommunity(communityId));
        } else {
            const { ...rest } = PostInputSchema.parse(body);
            return res
                .status(200)
                .json(await createPost({ ...rest, communityId }));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}
