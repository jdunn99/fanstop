import { deleteNotification } from "@/lib/api/notification";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["GET", "DELETE"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const { id } = z.object({ id: z.string().cuid() }).parse(query);

    if (!methods.includes(method!)) {
      res.status(400).json({ message: "Invalid query" });
      return;
    }

    switch (method) {
      case "GET": {
        res.status(400).json("Not implemented");
        return;
      }
      case "DELETE": {
        const session = await getServerSession(req, res, authOptions);
        if (session === null) {
          res.status(401).json({ message: "Not logged in" });
          return;
        }

        await deleteNotification(id, session.user.id);
        res.status(200).json({ success: true });

        return;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
