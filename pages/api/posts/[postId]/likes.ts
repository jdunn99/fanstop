import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";
import { unlikePost } from "@/lib/api/like";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const { postId } = z.object({ postId: z.string() }).parse(query);
    const session = await getServerSession(req, res, authOptions);

    if (method !== "DELETE") {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    if (session === null) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }

    const result = await unlikePost({ userId: session.user.id, postId });

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
