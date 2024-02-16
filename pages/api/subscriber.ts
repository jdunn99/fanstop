import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { z } from "zod";
import { createLike } from "@/lib/api/like";
import {
  deleteSubscriber,
  subscribeToCommunity,
} from "@/lib/api/subscriptions";
import { unsubscribe } from "diagnostics_channel";

const methods = ["GET", "POST", "DELETE"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body } = req;
    const session = await getServerSession(req, res, authOptions);

    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "GET") {
      res.status(200).json({ message: "Not implemented" });
      return;
    }

    if (session === null)
      return res.status(403).send({ message: "Not authorized" });

    const { communityId } = z.object({ communityId: z.string() }).parse(body);

    if (method === "POST") {
      const result = await subscribeToCommunity({
        communityId,
        user: session.user,
      });
      res.status(200).json(result);
    } else {
      await deleteSubscriber(communityId, session.user.id);
      res.status(200).json({ success: true });
    }
    return;
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
