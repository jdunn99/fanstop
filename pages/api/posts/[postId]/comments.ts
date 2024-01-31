import { getCommentsForPost } from "@/lib/api/comment";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const { postId } = z.object({ postId: z.string() }).parse(query);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid message" });
      return;
    }

    const result = await getCommentsForPost({ id: postId });
    res.status(200).json(result);

    return;
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
