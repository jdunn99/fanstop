import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";

const methods = ["GET", "PUT", "DELETE"];
const QuerySchema = z.object({ postId: z.string() });

const PostArgsSchema = z.object({
  postId: z.string().cuid(),
  authorId: z.string().cuid(),
});
type PostArgs = z.infer<typeof PostArgsSchema>;

export const PostPatchSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  content: z.any().optional().nullable(),
});

type PostInputArgs = z.infer<typeof PostPatchSchema> & PostArgs;

async function getPostByID(postId: string, authorId?: string) {
  return await db.post.findFirst({
    where: { id: postId },
    include: { likes: true },
  });
}

export async function addViewToPost(postId: string) {
  await db.post.update({
    where: { id: postId },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}

// Experimenting
async function deletePost({ postId, authorId }: PostArgs) {
  await db.post.delete({ where: { id: postId, authorId } });
}

async function updatePost({
  postId,
  authorId,
  content,
  title,
  description,
}: PostInputArgs) {
  return await db.post.update({
    where: { id: postId, authorId },
    data: {
      title,
      description,
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
      const session = await getServerSession(req, res, authOptions);
      if (session === null) {
        res.status(403).send({ message: "Not authorized" });
      }

      const authorId = session!.user.id;

      if (method === "PUT") {
        const { content, title, description } = PostPatchSchema.parse(body);

        return res.status(200).json(
          await updatePost({
            postId,
            content,
            title,
            description,
            authorId,
          })
        );
      } else {
        return res.status(200).json(await deletePost({ postId, authorId }));
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
