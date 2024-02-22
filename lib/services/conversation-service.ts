import { Conversation } from "../api/validators";
import { db } from "../db";
import {
  PaginationArgs,
  PaginationArgsWithID,
  PaginationResponse,
  paginationArgs,
} from "../pagination";

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
      id: true,
      community: {
        select: {
          slug: true,
        },
      },
      name: true,
      image: true,
    },
    take: 1,
  },
};

export const ConversationService = {
  async getConversations({ cursor, take }: PaginationArgs = {}) {
    const result = await db.conversation.findMany({
      ...paginationArgs({ cursor, take }),
    });

    if (!result) {
      throw new Error("Something went wrong fetching the data");
    }

    return {
      cursor: result[result.length - 1].id,
      result,
    };
  },

  async getConversationsForUser({
    id,
    cursor,
    take,
  }: PaginationArgsWithID): Promise<PaginationResponse<Conversation[]>> {
    const result = (await db.conversation.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
      include: {
        messages: CONVERSATIONS_FOR_USER_INCLUDE.messages,
        users: {
          where: {
            NOT: {
              id,
            },
          },
          ...CONVERSATIONS_FOR_USER_INCLUDE.users,
        },
      },
      ...paginationArgs({ cursor, take }),
    })) as Conversation[];

    if (result === null) {
      throw new Error("Something went wrong fetching conversations.");
    }

    return {
      response: result,
      cursor: result[result.length - 1].id,
    };
  },

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
};
