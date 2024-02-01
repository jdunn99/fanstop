import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { z } from "zod";
import { createLike } from "@/lib/api/like";

const methods = ["GET", "POST"];

async function getAllLikes() {
  return await db.likes.findMany();
}

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
      res.status(200).json(await getAllLikes());
      return;
    }

    if (session === null)
      return res.status(403).send({ message: "Not authorized" });

    const { postId } = z.object({ postId: z.string().cuid() }).parse(body);

    const result = await createLike({ postId, userId: session.user.id });
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
