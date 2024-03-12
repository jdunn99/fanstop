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
};
