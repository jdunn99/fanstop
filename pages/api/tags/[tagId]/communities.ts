import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const QuerySchema = z.object({
  tagId: z.string(),
  limit: z.number().int().default(4).optional(),
});
type CommunityTagQuery = z.infer<typeof QuerySchema>;

export const CommunityByTagSchema = z.object({
  id: z.string().cuid(),
  slug: z.string(),
  creator: z.object({
    id: z.string().cuid(),
    name: z.string(),
  }),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
});
export type CommunityByTag = z.infer<typeof CommunityByTagSchema>;

async function getCommunitiesByTag({ tagId, limit }: CommunityTagQuery) {
  return await db.community.findMany({
    take: limit,
    where: {
      tags: {
        some: {
          name: {
            equals: tagId,
          },
        },
      },
    },
    include: {
      creator: {
        select: {
          name: true,
        },
      },
    },
  });
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

    const { tagId, limit } = QuerySchema.parse(query);

    return res.status(200).json(await getCommunitiesByTag({ tagId, limit }));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
