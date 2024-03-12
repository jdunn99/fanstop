import { Prisma } from "@prisma/client";
import { db } from "../db";
import {
  PaginationArgs,
  PaginationResponse,
  getPaginatedMetadata,
  paginationArgs,
} from "../pagination";
import {
  PostVailidators,
  PostItem,
  PostResponse,
  PostContent,
  CreatePostArgs,
  PostUpdateArgs,
} from "../api/validators";
import { LikeService } from "./like-service";
import { SubscriberService } from "./subscriber-service";

export const DB_POST_INCLUDE = {
  id: true,
  description: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  sequence: true,
  isPublished: true,
  subscribersOnly: true,
  commentsVisible: true,
  image: true,
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

    const { isPublished } = post;
    // Only add unpublished posts if we are the author
    if (!isAuthor && !isPublished) {
      continue;
    }

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
  async createPost({ title, description, authorId }: CreatePostArgs) {
    return await db.post.create({
      data: {
        isPublished: false,
        description,
        title,
        views: 0,
        community: {
          connect: {
            creatorId: authorId,
          },
        },
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  },

  deletePost(id: string, authorId: string) {
    return db.post.delete({
      where: {
        id,
        authorId,
      },
    });
  },

  async getPosts(
    where: Prisma.PostWhereInput,
    { authorId, take, cursor }: { authorId?: string } & PaginationArgs
  ): Promise<PaginationResponse<PostResponse[]>> {
    const result = await db.post.findMany({
      where,
      select: DB_POST_INCLUDE,
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
      select: DB_POST_INCLUDE,
    });

    const post = PostVailidators.PostSchema.parse(result);
    const metadata = await getPostMetadata(post, userId);

    return {
      post,
      ...metadata,
    };
  },

  async getPostContent(id: string, userId?: string) {
    const result = await db.post.findFirst({
      where: {
        id,
        OR: [
          {
            isPublished: true,
          },
          {
            authorId: userId,
          },
        ],
      },
      select: {
        subscribersOnly: true,
        content: true,
        community: {
          select: {
            slug: true,
          },
        },
        authorId: true,
      },
    });

    if (result === null) {
      throw new Error("Post not found");
    }

    const { authorId, content, subscribersOnly, community } = result;

    if (
      subscribersOnly &&
      userId !== authorId &&
      typeof userId !== "undefined"
    ) {
      const isSubscriber = await SubscriberService.checkSubscriber({
        slug: community.slug,
        userId,
      });

      if (!isSubscriber) {
        return null;
      }
    }

    return content as unknown as PostContent[];
  },

  async getPopularPosts({
    take,
    userId,
  }: PaginationArgs & {
    userId?: string;
  }) {
    const result = await db.post.findMany({
      where: {
        isPublished: true,
        NOT: {
          authorId: userId,
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      take,
      select: DB_POST_INCLUDE,
    });
    const posts = PostVailidators.PostSchema.array().parse(result);

    return await buildPostResponse(posts, userId);
  },

  async getFeedForUser(userId: string, { take, cursor }: PaginationArgs) {
    const result = await db.post.findMany({
      where: {
        isPublished: true,
        community: {
          subscribers: {
            some: {
              userId,
            },
          },
        },
      },
      select: DB_POST_INCLUDE,
      ...paginationArgs({ take, cursor }),
    });

    if (result === null) {
      throw new Error("Something went wrong fetching your feed");
    }

    const posts = PostVailidators.PostSchema.array().parse(result);
    const response = await buildPostResponse(posts, userId);
    const { cursor: newCursor, hasMore } = getPaginatedMetadata(result, take);

    return {
      response,
      hasMore,
      cursor: newCursor,
    };
  },

  updatePost({ id, authorId, group, ...rest }: PostUpdateArgs) {
    const connection =
      typeof group !== "undefined"
        ? {
            group: {
              connect: {
                name: group,
              },
            },
          }
        : {
            group: {
              disconnect: true,
            },
          };

    return db.post.update({
      where: {
        id,
        authorId,
      },
      data: {
        ...connection,
        ...rest,
      },
      select: DB_POST_INCLUDE,
    });
  },
};
