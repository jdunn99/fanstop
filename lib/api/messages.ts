import { z } from "zod";
import { db } from "../db";
import { Message } from "./validators";

export async function getMessagesForConversation(id: string, userId: string) {
  return await db.message.findMany({
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
  });
}

export async function createMessage({
  content,
  conversationId,
  userId,
}: Pick<Message, "content" | "conversationId" | "userId">) {
  console.log("Creating message");
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
}
