import { Conversation, ConversationValidators } from "../api/validators";
import { db } from "../db";
import {
  PaginationArgs,
  PaginationArgsWithID,
  PaginationResponse,
  getPaginatedMetadata,
  paginationArgs,
} from "../pagination";
import { USER_WITH_IMAGE } from "./user-service";

const CONVERSATIONS_FOR_USER_INCLUDE = {
  messages: {
    select: {
      content: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc" as unknown as any,
    },
    take: 1,
  },
  users: {
    select: {
      ...USER_WITH_IMAGE,
      community: {
        select: {
          slug: true,
        },
      },
    },
    take: 1,
  },
};

/**
 * Defines service functions for calling Prisma and transforming data
 */
export const ConversationService = {
  /**
   * Get all conversations
   * @returns Paginated list of conversations
   */
  async getConversations({ cursor, take }: PaginationArgs = {}): Promise<
    PaginationResponse<Conversation[]>
  > {
    const result = await db.conversation.findMany({
      ...paginationArgs({ cursor, take }),
    });

    if (!result) {
      throw new Error("Something went wrong fetching the data");
    }

    const { cursor: newCursor, hasMore } = getPaginatedMetadata(result, take);
    const conversations =
      ConversationValidators.ConversationSchema.array().parse(result);

    return {
      cursor: newCursor,
      response: conversations,
      hasMore,
    };
  },

  /**
   * Gets the conversations for the currently signed in user
   * @returns The paginated list of conversations for the signed in user
   */
  async getConversationsForUser({
    id,
    cursor,
    take: paginationTake,
  }: PaginationArgsWithID): Promise<PaginationResponse<Conversation[]>> {
    const { messages, users } = CONVERSATIONS_FOR_USER_INCLUDE;
    const { select, take } = users;

    const where = {
      NOT: {
        id,
      },
    };

    const result = await db.conversation.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
      include: {
        messages,
        users: {
          where,
          select,
          take,
        },
      },

      ...paginationArgs({ cursor, take: paginationTake }),
    });

    if (result === null) {
      throw new Error("Something went wrong fetching conversations.");
    }

    const { hasMore, cursor: newCursor } = getPaginatedMetadata(result, take);
    const conversations =
      ConversationValidators.ConversationSchema.array().parse(result);

    return {
      hasMore,
      response: conversations,
      cursor: newCursor,
    };
  },

  /**
   * Gets a list of conversations between a list of participants
   * @param participants - The list of participants we are requesting conversations between
   * @returns A list of conversations between the participants
   */
  async getConversationForParticipants(participants: string[]) {
    return await db.conversation.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: participants,
            },
          },
        },
      },
    });
  },

  /**
   * Gets a requested conversation. User must be authenticated.
   * @param id - The requested conversation id
   * @param userId - The authenticated user id
   */
  async getConversationByID(id: string, userId: string) {
    return await db.conversation.findFirst({
      where: {
        id,
      },
      include: {
        users: {
          where: {
            NOT: {
              id: userId,
            },
          },
          select: USER_WITH_IMAGE,
        },
      },
    });
  },

  /**
   * Create a conversation given a list of participants
   * @param participants - The list of participants we are requesting to create a conversation between
   * @returns The newly created conversation
   */
  async createConversation(participants: string[]) {
    // session user id is always at the end of the list
    const userId = participants[participants.length - 1];
    const connect = participants.map((id) => ({ id }));

    const { messages, users } = CONVERSATIONS_FOR_USER_INCLUDE;
    const { select, take } = users;

    const where = {
      NOT: {
        id: userId,
      },
    };

    return await db.conversation.create({
      data: {
        users: {
          connect,
        },
      },
      include: {
        messages,
        users: {
          where,
          select,
          take,
        },
      },
    });
  },
};
