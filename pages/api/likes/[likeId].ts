import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["GET", "DELETE"];
const QuerySchema = z.object({ likeId: z.string().cuid() });

const LikeArgsSchmea = z.object({
  likeId: z.string().cuid(),
  userId: z.string().cuid(),
});

type LikeArgs = z.infer<typeof LikeArgsSchmea>;

async function getLikeByID(likeId: string) {
  return await db.likes.findFirst({ where: { id: { equals: likeId } } });
}

async function deleteLike({ likeId, userId }: LikeArgs) {
  await db.likes.delete({ where: { id: likeId, userId } });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const { likeId } = QuerySchema.parse(query);
    console.log({ likeId });

    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "GET") {
      return res.status(200).json(await getLikeByID(likeId));
    } else {
      const session = await getServerSession(req, res, authOptions);
      if (session === null) {
        res.status(403).send({ message: "Not authorized" });
      }

      const userId = session!.user.id;

      return res.status(200).json(await deleteLike({ likeId, userId }));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
