import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import {
  createConversation,
  getConversationByParticipantIds,
  getConversationsForUser,
} from "@/lib/api/conversations";
import { z } from "zod";

const methods = ["GET", "POST"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body, query } = req;
    const session = await getServerSession(req, res, authOptions);

    if (!methods.includes(method!)) {
      res.status(400).json({ message: "Invalid Method" });
      return;
    }

    if (session === null) {
      res.status(400).json({ message: "Not logged in" });
      return;
    }

    if (method === "GET") {
      const parsed = z
        .object({
          participants: z.string(),
        })
        .safeParse(query);

      if (parsed.success) {
        const participants = JSON.parse(parsed.data.participants);

        const data = await getConversationByParticipantIds([
          ...participants,
          session.user.id,
        ]);

        res.status(200).json(data);
        return;
      } else {
        const result = await getConversationsForUser(session.user.id);
        res.status(200).json(result);
        return;
      }
    } else {
      const { userIds } = body;
      console.log(userIds);
      const result = await createConversation([...userIds, session.user.id]);
      res.status(200).json(result);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
