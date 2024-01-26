import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["GET", "POST"];

const PostSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  image: z.string().nullable(),
  content: z.any().nullable(),
  description: z.string().nullable(),
  views: z.number(),
  creatorId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Post = z.infer<typeof PostSchema>;

const CreatePostSchema = z.object({
  title: z.string(),
});
export type CreatePostArgs = z.infer<typeof CreatePostSchema> & {
  authorId: string;
};

/**
 * Fetches a list of all posts from the database.
 * @returns
 */
async function getAllPosts() {
  return await db.post.findMany();
}

async function createPost({ title, authorId }: CreatePostArgs) {
  return await db.post.create({
    data: {
      title,
      views: 0,
      community: {
        connect: {
          creatorId: authorId,
        },
      },
      author: {
        connect: {
          id: authorId,
        },
      },
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body } = req;
    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (session === null)
        return res.status(403).send({ message: "Not authorized" });

      const data = CreatePostSchema.parse(body);
      return res.status(200).json(
        await createPost({
          ...data,
          authorId: session.user.id,
        })
      );
    } else {
      return res.status(200).json(await getAllPosts());
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
