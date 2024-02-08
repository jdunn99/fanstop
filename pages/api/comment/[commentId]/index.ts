import { deleteComment, updateComment } from "@/lib/api/comment";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query, body } = req;
    const { commentId } = z.object({ commentId: z.string() }).parse(query);
    const session = await getServerSession(req, res, authOptions);

    if (session === null) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }

    switch (method) {
      case "PUT": {
        const { content } = z.object({ content: z.string() }).parse(body);
        const result = await updateComment({
          id: commentId,
          content,
          userId: session.user.id,
        });
        res.status(200).json(result);
        return;
      }
      case "DELETE": {
        const result = await deleteComment(commentId, session.user.id);
        res.status(200).json(result);
        return;
      }
      default: {
        res.status(400).json({ message: "Invalid method" });
        return;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
