import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { db } from "@/lib/db";
import { z } from "zod";
import { CommunityByTagSchema } from "../tags/[tagId]/communities";
import { PostItemSchema } from "./feed";

const ProfileSchema = z.object({
  featuredPost: PostItemSchema.nullable(),
  posts: z.array(PostItemSchema),
  community: CommunityByTagSchema,
});
export type Profile = z.infer<typeof ProfileSchema>;

export async function getUserProfile(id: string) {
  const result = await db.user.findFirst({
    where: { id },
    include: {
      community: true,
      posts: {
        include: {
          author: {
            include: {
              community: true,
            },
          },
          likes: true,
        },
      },
    },
  });

  if (!result) throw new Error();
  const { community } = result;

  if (result.posts.length === 0) {
    const parsed = {
      featuredPost: null,
      posts: [],
      community,
    };

    return ProfileSchema.parse(parsed);
  }

  const [featuredPost, ...posts] = result.posts;

  const parsed = {
    featuredPost,
    posts,
    community,
  };

  return ProfileSchema.parse(parsed);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(403).send({ message: "Not authorized" });

    if (method !== "GET") {
      return res.status(400).send({ message: "Invalid Method" });
    }

    return res.status(200).json(await getUserProfile(session.user.id));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
