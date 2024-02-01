import { db } from "../db";

export async function checkPostLiked({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const result = await db.likes.count({
    where: {
      postId,
      userId,
    },
  });

  return result > 0;
}
