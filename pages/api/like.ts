import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "./auth/[...nextauth]";

const methods = ["GET", "POST"];

const CreateLikeSchema = z.object({
  postId: z.string().cuid(),
  userId: z.string().cuid(),
});

const LikeSchema = z
  .object({
    id: z.string().cuid(),
  })
  .merge(CreateLikeSchema);

type CreateLikeArgs = z.infer<typeof CreateLikeSchema>;
export type Like = z.infer<typeof LikeSchema>;

async function getAllLikes() {
  return await db.likes.findMany();
}

async function createLike({ userId, postId }: CreateLikeArgs) {
  return await db.likes.create({
    data: {
      postId,
      userId,
    },
    include: { user: { select: { name: true } } },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body } = req;
    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (session === null)
        return res.status(403).send({ message: "Not authorized" });

      const data = CreateLikeSchema.parse({
        postId: body.postId,
        userId: session.user.id,
      });
      return res.status(200).json(await createLike(data));
    } else {
      return res.status(200).json(await getAllLikes());
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
