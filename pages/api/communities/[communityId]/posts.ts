import { getPostsForCommunity } from "@/lib/api/post";
import { CommunitiesValidators, PostItem } from "@/lib/api/validators";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { Post } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const session = await getServerSession(req, res, authOptions);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid method" });
    }

    let authorId: string | undefined;
    const { communityId } =
      CommunitiesValidators.CommunityQuerySchema.parse(query);

    if (session) {
      authorId = session.user.id;
    }

    console.log("FETCHING: ", communityId, authorId);
    const result = await getPostsForCommunity({ id: communityId, authorId });

    let featuredPost: PostItem | null = null;
    let recentPosts: PostItem[];
    let posts: PostItem[] = [];
    const unpublishedPosts: PostItem[] = [];
    const published: PostItem[] = [];

    if (result === null) {
      throw new Error("Object not found");
    }

    for (const { isAuthor, post } of result) {
      //  if the user is the author return unpublisehd posts. otherwise don't
      if (isAuthor) {
        if (!post.isPublished) {
          unpublishedPosts.push(post);
        } else {
          published.push(post);
        }
      } else {
        if (post.isPublished) {
          published.push(post);
        }
      }
    }

    featuredPost = published[0];
    recentPosts = published.slice(1, 4) || [];
    posts = published.slice(4) || [];

    res.status(200).json({
      featuredPost,
      recentPosts,
      posts,
      unpublishedPosts,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
