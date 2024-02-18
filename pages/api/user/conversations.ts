import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import {
  createConversation,
  getConversationsForUser,
} from "@/lib/api/conversations";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const session = await getServerSession(req, res, authOptions);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid Method" });
      return;
    }

    if (session === null) {
      res.status(400).json({ message: "Not logged in" });
      return;
    }

    const result = await getConversationsForUser(session.user.id);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
