import { createMessage, getMessagesForConversation } from "@/lib/api/messages";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";
import { getConversationById } from "@/lib/api/conversations";

const methods = ["GET", "POST"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query, body } = req;
    const session = await getServerSession(req, res, authOptions);

    if (!methods.includes(method!)) {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    if (session === null) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    const { conversationId } = z
      .object({ conversationId: z.string().cuid() })
      .parse(query);

    if (method === "GET") {
      const messages = await getConversationById(
        conversationId,
        session.user.id
      );

      res.status(200).json(messages);
      return;
    } else {
      const { content } = body;
      const result = await createMessage({
        userId: session.user.id,
        conversationId,
        content,
      });
      res.status(200).json(result);
    }
    // get messages for conversation
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
