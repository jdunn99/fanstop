import { Message, MessagesValidators } from "../api/validators";
import { db } from "../db";
import {
  PaginationArgs,
  PaginationResponse,
  getPaginatedMetadata,
  paginationArgs,
} from "../pagination";

export const MessageService = {
  async getMessagesForConversation(
    id: string,
    userId: string,
    args: PaginationArgs
  ): Promise<PaginationResponse<Message[]>> {
    const result = await db.message.findMany({
      where: {
        conversationId: id,
        conversation: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...paginationArgs(args),
    });

    const response = MessagesValidators.MessageSchema.array().parse(result);

    const { take } = args;
    const { hasMore, cursor } = getPaginatedMetadata(result, take);

    return {
      response,
      hasMore,
      cursor,
    };
  },

  async createMessage({
    content,
    conversationId,
    userId,
  }: Pick<Message, "content" | "conversationId" | "userId">) {
    return await db.message.create({
      data: {
        content,
        conversationId,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  },
};
