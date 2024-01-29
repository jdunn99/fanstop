import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["GET", "PUT", "DELETE"];
const QuerySchema = z.object({ commentId: z.string() });

const CommentArgsSchema = z.object({
  commentId: z.string().cuid(),
  authorId: z.string().cuid(),
});
export const CommentPatchSchema = z.object({
  content: z.string(),
});

type CommentArgs = z.infer<typeof CommentArgsSchema>;
type CommentInputArgs = z.infer<typeof CommentPatchSchema> & CommentArgs;

async function getCommentById(commentId: string) {
  return await db.post.findFirst({ where: { id: { equals: commentId } } });
}

async function deleteComment({ commentId, authorId }: CommentArgs) {
  await db.comment.delete({ where: { id: commentId, userId: authorId } });
}

async function updateComment({
  commentId,
  authorId,
  content,
}: CommentInputArgs) {
  console.log(commentId, authorId, content);
  return await db.comment.update({
    where: { id: commentId, userId: authorId },
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
    const { commentId } = QuerySchema.parse(query);

    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "GET") {
      return res.status(200).json(await getCommentById(commentId));
    } else {
      const session = await getServerSession(req, res, authOptions);
      if (session === null) {
        res.status(403).send({ message: "Not authorized" });
      }

      const authorId = session!.user.id;

      if (method === "PUT") {
        const { content } = CommentPatchSchema.parse(body);

        return res.status(200).json(
          await updateComment({
            commentId,
            content,
            authorId,
          })
        );
      } else {
        return res
          .status(200)
          .json(await deleteComment({ commentId, authorId }));
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
