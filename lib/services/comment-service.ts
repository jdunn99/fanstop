import { Comment, CommentValidators } from "../api/validators";
import { db } from "../db";
import {
  PaginationResponse,
  PaginationArgsWithID,
  paginationArgs,
  getPaginatedMetadata,
} from "../pagination";
import { USER_WITH_IMAGE } from "./user-service";

export const CommentService = {
  /**
   * Adds a comment to the database
   * @param data - The underlying data for the comments
   * @returns The newly created comment
   */
  createComment(data: Pick<Comment, "userId" | "postId" | "content">) {
    return db.comment.create({
      data,
      include: {
        user: {
          select: USER_WITH_IMAGE,
        },
      },
    }) as Promise<Comment>;
  },

  /**
   * Updated a comment given their id
   * @param - The id and new content of the comment being updated
   * @returns The newly updated comment
   */
  updateComment({
    id,
    userId,
    content,
  }: Pick<Comment, "content" | "userId" | "id">) {
    return db.comment.update({
      where: {
        id,
        userId,
      },
      data: {
        content,
      },
    });
  },

  /**
   * Deletes a comment by id
   * @param where - The ID of the comment being deleted
   * @returns - The deleted comment
   */
  deleteComment(where: Pick<Comment, "id" | "userId">) {
    return db.comment.delete({
      where,
    });
  },

  /**
   * Returns a paginated list of comments
   * @param postId
   * @returns
   */
  async getCommentsForPost({
    id,
    cursor,
    take,
  }: PaginationArgsWithID): Promise<PaginationResponse<Comment[]>> {
    const result = await db.comment.findMany({
      where: {
        postId: id,
      },
      include: {
        user: {
          select: USER_WITH_IMAGE,
        },
      },
      orderBy: {
        createdAt: "desc",
      },

      ...paginationArgs({ cursor, take }),
    });

    if (result === null) {
      throw new Error("Something went wrong fetching comments.");
    }

    const { hasMore, cursor: newCursor } = getPaginatedMetadata(result, take);

    return {
      response: CommentValidators.CommentSchema.array().parse(result),
      cursor: newCursor,
      hasMore,
    };
  },
};
