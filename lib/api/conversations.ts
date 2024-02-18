import { db } from "../db";
import { ConversationValidators } from "./validators";

export async function getConversationsForUser(userId: string) {
  try {
    const result = await db.conversation.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: {
          select: {
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        users: {
          where: {
            NOT: {
              id: userId,
            },
          },
          select: {
            id: true,
            community: {
              select: {
                slug: true,
              },
            },
            image: true,
            name: true,
          },
          take: 1,
        },
      },
    });

    if (!result) {
      throw new Error("Somethihng went wrong fetching conversation");
    }

    return ConversationValidators.ConversationSchema.array().parse(result);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createConversation(userIds: string[]) {
  return await db.conversation.create({
    data: {
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
}

export async function getConversationById(id: string, userId: string) {
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
        select: {
          image: true,
          name: true,
        },
      },
    },
  });
}

export async function getConversationByParticipantIds(participants: string[]) {
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
}
