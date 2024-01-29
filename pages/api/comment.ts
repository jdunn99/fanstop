import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "./auth/[...nextauth]";

const methods = ["GET", "POST"];

const CreateCommentSchema = z.object({
  content: z.string(),
  postId: z.string(),
});
export type CreateCommentArgs = z.infer<typeof CreateCommentSchema> & {
  authorId: string;
};

async function getAllComments() {
  return await db.comment.findMany();
}

async function createComment({ content, postId, authorId }: CreateCommentArgs) {
  return await db.comment.create({
    data: {
      content,
      postId,
      userId: authorId,
    },
    include: { user: { select: { id: true, name: true } } },
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

      const data = CreateCommentSchema.parse(body);
      return res.status(200).json(
        await createComment({
          ...data,
          authorId: session.user.id,
        })
      );
    } else {
      return res.status(200).json(await getAllComments());
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
