import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { db } from "@/lib/db";
import { PostItemSchema } from "../feed";
import { z } from "zod";

const QuerySchema = z.object({
  id: z.string().cuid(),
});

async function getPostsForUser(id: string) {
  const result = await db.post.findMany({
    where: { authorId: { equals: id } },
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

  return PostItemSchema.parse(result);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;

    if (method !== "GET") {
      return res.status(400).send({ message: "Invalid Method" });
    }

    const { id } = QuerySchema.parse(query);
    return res.status(200).json(await getPostsForUser(id));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
