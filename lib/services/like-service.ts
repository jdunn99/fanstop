import { db } from "../db";

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

  addLike(postId: string, userId: string) {
    return db.likes.create({
      data: {
        postId,
        userId,
      },
    });
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
