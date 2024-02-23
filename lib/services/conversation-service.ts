import { Conversation } from "../api/validators";
import { db } from "../db";
import {
  PaginationArgs,
  PaginationArgsWithID,
  PaginationResponse,
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

    return {
      response: result as Conversation[],
      cursor: result[result.length - 1].sequence,
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
