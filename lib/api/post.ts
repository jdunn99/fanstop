import { db } from "../db";
import {
  CreatePostArgs,
  FeedItem,
  PostArraySchema,
  PostContent,
  PostResponse,
  PostUpdateArgs,
  PostVailidators,
} from "./validators";
import { checkSubscriber } from "./community";
import { checkPostLiked } from "./like";
import { getSubscriptionsForUser } from "./subscriptions";

export type PostQuery = {
  id: string;
  authorId?: string;
};

const DB_POST_INCLUDE = {
  _count: {
    select: {
      likes: true,
      comments: true,
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

export async function getPostsForCommunity({
  id,
  authorId,
  take,
}: PostQuery & {
  take?: number;
}): Promise<PostResponse[] | null> {
  try {
    const result = await db.post.findMany({
      where: {
        OR: [
          {
            OR: [
              {
                communityId: id,
              },
              {
                community: {
                  slug: id,
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: DB_POST_INCLUDE,
      take,
    });

    if (result === null) {
      throw new Error("Not found");
    }

    const posts = PostArraySchema.parse(result);
    const response: PostResponse[] = [];

    const isSubscriber =
      typeof authorId === "undefined"
        ? false
        : await checkSubscriber({ communityId: id, userId: authorId });

    for (const post of posts) {
      const isAuthor =
        typeof authorId !== "undefined" && authorId === post.author.id;

      const isLiked =
        typeof authorId !== "undefined" &&
        (await checkPostLiked({ postId: post.id, userId: authorId }));

      response.push({
        post,
        isAuthor,
        isSubscriber,
        isLiked,
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPostByID({
  id,
  authorId,
}: PostQuery): Promise<PostResponse | null> {
  try {
    const result = await db.post.findFirst({
      where: { id },
      include: DB_POST_INCLUDE,
    });

    if (result === null) {
      throw new Error("Not found");
    }

    const post = PostVailidators.PostSchema.parse(result);

    const isAuthor =
      typeof authorId !== "undefined" && post.author.id === authorId;

    const isSubscriber = isAuthor
      ? false
      : typeof authorId !== "undefined" &&
        (await checkSubscriber({
          communityId: post.author.community.slug,
          userId: authorId,
        }));

    const isLiked =
      typeof authorId !== "undefined" &&
      (await checkPostLiked({
        postId: id,
        userId: authorId,
      }));

    return {
      post,
      isSubscriber,
      isAuthor,
      isLiked,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPostContent({
  id: postId,
  authorId,
}: PostQuery): Promise<PostContent[] | null> {
  try {
    const result = await db.post.findFirst({
      where: {
        id: postId,
        OR: [{ isPublished: true }, { authorId }],
      },
      select: {
        subscribersOnly: true,
        content: true,
        communityId: true,
        authorId: true,
      },
    });

    if (result === null) {
      throw new Error("Post not found");
    }

    const { authorId: id, content, subscribersOnly, communityId } = result;

    if (subscribersOnly && authorId !== id) {
      const isSubscriber = await checkSubscriber({
        communityId,
        userId: authorId!,
      });
      if (!isSubscriber) {
        return null;
      }
    }

    // Zod is having issues with Prisma.JsonValue being cast to array
    // So for now, ignoring zod check.
    // Should be typesafe anyways since zod checks it on the frontend before uploading a post's content
    return content as unknown as PostContent[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updatePost({ id, authorId, ...data }: PostUpdateArgs) {
  try {
    const result = await db.post.update({
      where: {
        id,
        authorId,
      },
      data,
      include: DB_POST_INCLUDE,
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getFeedForUser(userId: string) {
  try {
    const subscriptions = await getSubscriptionsForUser(userId);

    if (!subscriptions) {
      throw new Error("Something went wrong fetching subscriptions");
    }

    const result = await db.post.findMany({
      where: {
        communityId: {
          in: subscriptions.map(({ communityId }) => communityId),
        },
        isPublished: true,
      },
      include: DB_POST_INCLUDE,
      orderBy: {
        createdAt: "desc",
      },
    });

    const parsed = PostArraySchema.parse(result);
    const feed: FeedItem = {};

    const { format } = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // parse the date and some post metadata
    for (const post of parsed) {
      const key = format(post.createdAt);

      if (!feed[key]) {
        feed[key] = [];
      }

      const isLiked = await checkPostLiked({
        postId: post.id,
        userId,
      });

      feed[key].push({ post, isAuthor: false, isSubscriber: true, isLiked });
    }

    return feed;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createPost({
  title,
  description,
  authorId,
}: CreatePostArgs) {
  try {
    const result = await db.post.create({
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
      include: DB_POST_INCLUDE,
    });

    return PostVailidators.PostSchema.parse(result);
  } catch (error) {
    console.error(error);
    return null;
  }
}
