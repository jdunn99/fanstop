import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSubscriptionsForUser } from "./subscriptions";

export const PostItemSchema = z.object({
  id: z.string().cuid(),
  author: z.object({
    name: z.string(),
    community: z.object({
      slug: z.string(),
      name: z.string(),
    }),
    image: z.string().nullable(),
  }),
  title: z.string(),
  createdAt: z.date(),
  views: z.number(),
  description: z.string(),
});
export type PostItem = z.infer<typeof PostItemSchema>;

async function getFeedForUser(userId: string) {
  const subscriptions = await getSubscriptionsForUser(userId);

  if (!subscriptions)
    throw new Error("Something went wrong fetching subscriptions.");

  const result = await db.post.findMany({
    where: {
      communityId: {
        in: subscriptions.map(({ communityId }) => communityId),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      description: true,
      author: {
        select: {
          name: true,
          community: {
            select: {
              slug: true,
              name: true,
            },
          },
          image: true,
        },
      },
      title: true,
      createdAt: true,
      views: true,
    },
  });

  return z.array(PostItemSchema).parse(result);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    if (method !== "GET") {
      return res.status(400).send({ message: "Invalid request" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (session === null) {
      return res.status(403).send({ message: "Not authorized" });
    }

    return res.status(200).json(await getFeedForUser(session.user.id));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error });
  }
}
