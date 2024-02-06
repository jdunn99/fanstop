import { createPost } from "@/lib/api/post";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

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

    if (session === null) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }

    const result = await createPost({
      authorId: session.user.id,
      ...body,
    });

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
