import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const session = await getServerSession(req, res, authOptions);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    if (session === null) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    const result = await db.subscriber.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
