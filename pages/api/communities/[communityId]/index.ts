import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { PostItem, PostItemSchema } from "../../user/feed";

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
  description: z.string().optional().nullable(),
  posts: z.array(PostItemSchema),
});

type CommunityArgs = { communityId: string; name?: string; userId: string };

const CommunityBYIDQuerySchema = z
  .object({
    featuredPost: PostItemSchema.nullable().optional(),
    recentPosts: z.array(PostItemSchema),
    isOwn: z.boolean(),
  })
  .merge(CommunitySchema);
export type CommunityProfile = z.infer<typeof CommunityBYIDQuerySchema>;

export async function getCommunityByID(communityId: string) {
  const result = await db.community.findFirst({
    where: {
      OR: [{ id: { equals: communityId } }, { slug: { equals: communityId } }],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      creatorId: true,
      updatedAt: true,
      description: true,
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          image: true,
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
  });

  return CommunitySchema.nullable().parse(result);
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

    const session = await getSession({ req });

    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "GET") {
      const result = await getCommunityByID(communityId);
      let isOwn = false;
      let featuredPost: PostItem | null = null;
      let recentPosts: PostItem[] = [];
      let posts: PostItem[] = [];

      if (session && result) {
        isOwn = result.creatorId === session.user.id;
        featuredPost = result.posts[0];
        recentPosts = result.posts.slice(1, 4) || [];
        posts = result.posts.slice(4) || [];
      }

      console.log({ isOwn, featuredPost, recentPosts, posts });

      return res.status(200).json(
        CommunityBYIDQuerySchema.parse({
          ...result,
          isOwn,
          featuredPost,
          recentPosts,
          posts,
        })
      );
    } else {
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
