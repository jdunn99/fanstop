import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { getPostContent } from "@/lib/api/post";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { query, method } = req;
    const { postId } = z.object({ postId: z.string() }).parse(query);
    const session = await getServerSession(req, res, authOptions);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    const content = await getPostContent({
      id: postId,
      authorId: session?.user.id,
    });

    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
