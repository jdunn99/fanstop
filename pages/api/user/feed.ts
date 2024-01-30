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
  image: z.string().nullable(),
  title: z.string(),
  createdAt: z.date(),
  views: z.number(),
  description: z.string().nullable(),
  _count: z.object({
    likes: z.number(),
    comments: z.number(),
  }),
});
export type PostItem = z.infer<typeof PostItemSchema>;
export type FeedItem = Record<string, PostItem[]>;

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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      image: true,
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

  const parsed = z.array(PostItemSchema).parse(result);
  const data: FeedItem = {};

  const { format } = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  for (const item of parsed) {
    const dateKey = format(item.createdAt);
    if (!data[dateKey]) {
      data[dateKey] = [];
    }

    data[dateKey].push(item);
  }

  return data;
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
