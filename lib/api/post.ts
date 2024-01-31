import { z } from "zod";
import { db } from "../db";
import {
  PostArraySchema,
  PostContent,
  PostResponse,
  PostUpdateArgs,
  PostVailidators,
} from "./validators";
import { checkSubscriber } from "./community";
import { Prisma } from "@prisma/client";

export type PostQuery = {
  id: string;
  authorId?: string;
};

export async function getPostsForCommunity({
  id,
  authorId,
}: PostQuery): Promise<PostResponse[] | null> {
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
          {
            authorId,
          },
          {
            isPublished: true,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
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
      },
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
      response.push({
        post,
        isAuthor,
        isSubscriber,
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
      include: {
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
      },
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

    return {
      post,
      isSubscriber,
      isAuthor,
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
  console.log(`\n\n\n${JSON.stringify(data)}\n\n\n`);

  try {
    const result = await db.post.update({
      where: {
        id,
        authorId,
      },
      data,
      include: {
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
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}