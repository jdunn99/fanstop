import { db } from "../db";
import { NotificationService } from "./notification-service";

export const LikeService = {
  async isLiked(postId: string, userId: string) {
    return (
      (await db.likes.count({
        where: {
          postId,
          userId,
        },
      })) > 0
    );
  },

  async addLike(postId: string, userId: string) {
    const like = await db.likes.create({
      data: {
        postId,
        userId,
      },
      include: {
        user: {
          select: {
            community: {
              select: {
                slug: true,
                name: true,
              },
            },
          },
        },
        post: {
          select: {
            authorId: true,
            community: {
              select: {
                slug: true,
              },
            },
            title: true,
          },
        },
      },
    });

    if (like.post.authorId !== userId) {
      await NotificationService.createNotification({
        receiver: like.post.authorId,
        creator: userId,
        message:
          like.user.community!.name + " liked your post: " + like.post.title,
        path: `/${like.post.community.slug}/${like.postId}`,
      });
    }

    return like;
  },

  async removeLike(postId: string, userId: string) {
    const like = await db.likes.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (like === null) {
      throw new Error("Like not found");
    }

    return await db.likes.delete({
      where: {
        id: like.id,
      },
    });
  },
};
