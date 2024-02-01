import { db } from "../db";

type LikeQuery = {
  postId: string;
  userId: string;
};

export async function checkPostLiked({ postId, userId }: LikeQuery) {
  const result = await db.likes.count({
    where: {
      postId,
      userId,
    },
  });

  return result > 0;
}

export async function unlikePost({ postId, userId }: LikeQuery) {
  try {
    await db.likes.deleteMany({
      where: {
        userId,
        postId,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createLike({ userId, postId }: LikeQuery) {
  try {
    return await db.likes.create({
      data: {
        postId,
        userId,
      },
      include: { user: { select: { name: true } } },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
