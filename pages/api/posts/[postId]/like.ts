import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";

const methods = ["GET"];
const QuerySchema = z.object({ postId: z.string() });

async function getLikesForPost(postId: string) {
  return await db.likes.findMany({
    where: {
      postId,
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    console.log(method, query);
    const { postId } = QuerySchema.parse(query);

    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "GET") {
      return res.status(200).json(await getLikesForPost(postId));
    } else {
      // TODO: Make this a middleware that I can reuse without having to retype
      const session = await getServerSession(req, res, authOptions);
      if (session === null) {
        res.status(403).send({ message: "Not authorized" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}