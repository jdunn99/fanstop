import { Prisma } from "@prisma/client";
import { db } from "../db";
import {
  PaginationArgs,
  PaginationResponse,
  getPaginatedMetadata,
  paginationArgs,
} from "../pagination";
import { PostVailidators, PostItem, PostResponse } from "../api/validators";
import { LikeService } from "./like-service";
import { SubscriberService } from "./subscriber-service";

export const DB_POST_INCLUDE = {
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
  group: {
    select: {
      id: true,
      name: true,
    },
  },
  author: {
    select: {
      id: true,
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
};

/**
 * Retrieves the metadata for a post
 * @param post - The post we are getting metadata for
 * @param userId - The requesting User's ID for checking against metadata conditions
 * @returns - If the user if the author, if the user liked the post, if the user is subscribed to the creator of the post
 */
async function getPostMetadata(post: PostItem, userId?: string) {
  const isAuthor = typeof userId !== "undefined" && userId === post.author.id;

  const isLiked =
    typeof userId !== "undefined" &&
    (await LikeService.isLiked(post.id, userId));

  const isSubscriber =
    !isAuthor &&
    typeof userId !== "undefined" &&
    (await SubscriberService.checkSubscriber({
      slug: post.author.community.slug,
      userId: userId,
    }));

  return { isAuthor, isLiked, isSubscriber };
}

async function buildPostResponse(posts: PostItem[], userId?: string) {
  const response: PostResponse[] = [];

  for (const post of posts) {
    const { isAuthor, isLiked, isSubscriber } = await getPostMetadata(
      post,
      userId
    );

    response.push({
      isAuthor,
      isLiked,
      isSubscriber,
      post,
    });
  }

  return response;
}

export const PostService = {
  async getPosts(
    where: Prisma.PostWhereInput,
    { authorId, take, cursor }: { authorId?: string } & PaginationArgs
  ): Promise<PaginationResponse<PostResponse[]>> {
    const result = await db.post.findMany({
      where,
      include: DB_POST_INCLUDE,
      ...paginationArgs({ take, cursor }),
    });

    if (result === null) {
      throw new Error("Something went wrong fetching the posts.");
    }

    const posts = PostVailidators.PostSchema.array().parse(result);
    const response = await buildPostResponse(posts, authorId);

    const { cursor: newCursor, hasMore } = getPaginatedMetadata(result, take);

    return {
      response,
      hasMore,
      cursor: newCursor,
    };
  },

  async getPost(where: Prisma.PostWhereInput, userId?: string) {
    const result = await db.post.findFirst({
      where,
      include: DB_POST_INCLUDE,
    });

    const post = PostVailidators.PostSchema.parse(result);
    const metadata = await getPostMetadata(post, userId);

    return {
      post,
      ...metadata,
    };
  },
};
