import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";

const methods = ["GET", "PUT", "DELETE"];
const QuerySchema = z.object({ postId: z.string() });

const PostArgsSchema = z.object({
    postId: z.string().cuid(),
    authorId: z.string().cuid(),
});
type PostArgs = z.infer<typeof PostArgsSchema>;

// TODO: Some form of validation on the content JSON.
type PostInputArgs = PostArgs & { content?: object };

async function getPostByID(postId: string) {
    return await db.post.findFirst({ where: { id: { equals: postId } } });
}

// Experimenting
async function deletePost({ postId, authorId }: PostArgs) {
    await db.post.delete({ where: { id: postId, authorId } });
}

async function updatePost({ postId, authorId, content }: PostInputArgs) {
    await db.post.update({
        where: { id: postId, authorId },
        data: {
            content,
        },
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { method, body, query } = req;
        const { postId } = QuerySchema.parse(query);

        if (!methods.includes(method!)) {
            return res.status(400).send({ message: "Invalid Method" });
        }

        if (method === "GET") {
            return res.status(200).json(await getPostByID(postId));
        } else {
            // TODO: Make this a middleware that I can reuse without having to retype
            const session = await getSession({ req });
            if (session === null) {
                res.status(403).send({ message: "Not authorized" });
            }

            const authorId = session!.user.id;

            if (method === "PUT") {
                // TODO: Type safety
                const { content } = body;

                return res
                    .status(200)
                    .json(await updatePost({ postId, content, authorId }));
            } else {
                return res
                    .status(200)
                    .json(await deletePost({ postId, authorId }));
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}
