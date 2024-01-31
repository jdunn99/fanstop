import { PostQuery } from "./post";
import { Comment, CommentValidators, CreateCommentArgs } from "./validators";
import { db } from "@/lib/db";

export async function createComment(
  data: CreateCommentArgs
): Promise<Comment | null> {
  try {
    const result = await db.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return CommentValidators.CommentSchema.parse(result);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCommentsForPost({ id }: Pick<PostQuery, "id">) {
  try {
    return await db.comment.findMany({
      where: {
        postId: id,
      },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
