import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";

const methods = ["GET", "POST"];

const QuerySchema = z.object({
  communityId: z.string(),
});

async function getSubscribersForCommunity(communityId: string) {
  return await db.subscriber.findMany({
    where: {
      OR: [{ communityId: communityId }, { community: { slug: communityId } }],
    },
    select: {
      id: true,
      userId: true,
    },
  });
}

// TODO: Add some more error handling.
async function subscribeToCommunity(communityId: string, userId: string) {
  return await db.subscriber.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      community: {
        connect: {
          slug: communityId,
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
    const { communityId } = QuerySchema.parse(query);

    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "GET") {
      return res
        .status(200)
        .json(await getSubscribersForCommunity(communityId));
    } else {
      const session = await getServerSession(req, res, authOptions);
      if (session === null) {
        res.status(403).send({ message: "Not authorized" });
      }

      const userId = session!.user.id;

      return res
        .status(200)
        .json(await subscribeToCommunity(communityId, userId));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
