import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["GET", "POST"];

const CommunitySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  creatorId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Community = z.infer<typeof CommunitySchema>;

const CreateCommunitySchema = z.object({
  name: z.string(),
  slug: z.string(),
  tags: z.array(z.string().cuid()),
  description: z.string().default(""),
});
export type CreateCommunityArgs = z.infer<typeof CreateCommunitySchema>;
export type CreateCommunityInput = CreateCommunityArgs & {
  creatorId: string;
};

async function getAllCommunities() {
  return await db.community.findMany({
    include: {
      creator: {
        select: {
          name: true,
        },
      },
    },
  });
}

async function getAllCommunitiesExplore(userId: string) {
  return await db.community.findMany({
    where: { creatorId: { not: userId } },
    include: {
      creator: {
        select: {
          name: true,
        },
      },
    },
  });
}

async function createCommunity({
  name,
  slug,
  tags,
  description,
  creatorId,
}: CreateCommunityInput) {
  return await db.community.create({
    data: {
      description,
      name,
      slug,
      tags: {
        connect: tags.map((tag) => ({ id: tag })),
      },
      creator: {
        connect: {
          id: creatorId,
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
    const { method, body } = req;
    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (method === "POST") {
      if (session === null)
        return res.status(403).send({ message: "Not authorized" });

      const { name, slug, tags, description } =
        CreateCommunitySchema.parse(body);

      return res.status(200).json(
        await createCommunity({
          name,
          description,
          slug,
          tags,
          creatorId: session.user.id,
        })
      );
    } else {
      if (session === null) {
        return res.status(200).json(await getAllCommunities());
      }
      return res
        .status(200)
        .json(await getAllCommunitiesExplore(session.user.id));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
