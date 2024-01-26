import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { PostItemSchema } from "../../user/feed";

const methods = ["GET", "PUT", "DELETE"];

const QuerySchema = z.object({
  communityId: z.string(),
});

const CommunitySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  slug: z.string(),
  creatorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  posts: z.array(PostItemSchema),
});
export type CommunityProfile = z.infer<typeof CommunitySchema>;

type CommunityArgs = { communityId: string; name?: string; userId: string };

export async function getCommunityByID(communityId: string) {
  return CommunitySchema.nullable().parse(
    await db.community.findFirst({
      where: {
        OR: [
          { id: { equals: communityId } },
          { slug: { equals: communityId } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        creatorId: true,
        updatedAt: true,
        posts: {
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
        },
      },
    })
  );
}

// async function updateCommunity({ communityId, name, userId }: CommunityArgs) {
//     const result = await db.community.update({
//         where: {
//             id: communityId,
//             creatorId: {
//                 equals: userId,
//             },
//         },
//         data: {
//             name,
//         },
//     });

//     if (result === null) throw new Error();

//     return result;
// }

async function deleteCommunity({ communityId, userId }: CommunityArgs) {
  const community = await db.community.findFirst({
    where: { id: { equals: communityId }, creatorId: { equals: userId } },
  });

  if (community === null) throw new Error();

  await db.community.delete({ where: { id: communityId } });

  return { success: true };
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
      return res.status(200).json(await getCommunityByID(communityId));
    } else {
      const session = await getSession({ req });
      if (session === null) res.status(403).send({ message: "Not authorized" });

      const userId = session!.user.id;

      if (method === "PUT") {
        // const { name } = BodySchema.parse(body);
        // return res
        //     .status(200)
        //     .json(await updateCommunity({ communityId, userId, name }));
      } else {
        return res
          .status(200)
          .json(await deleteCommunity({ communityId, userId }));
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
