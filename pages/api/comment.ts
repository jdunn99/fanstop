import { createComment } from "@/lib/api/comment";
import { CommentValidators } from "@/lib/api/validators";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body } = req;
    const session = await getServerSession(req, res, authOptions);

    if (method !== "POST") {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    if (!session) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }

    const { content, postId } = body;
    const comment = await createComment(
      CommentValidators.CreateCommentSchema.parse({
        userId: session.user.id,
        content,
        postId,
      })
    );

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
  return;
}
