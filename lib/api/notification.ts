import { z } from "zod";
import { db } from "../db";
import { NotificationsValidators } from "./validators";

export async function getNotificationsForUser(userId: string) {
  try {
    return z.array(NotificationsValidators.NotifcationSchema).parse(
      await db.notification.findMany({
        where: {
          receiverId: userId,
        },
        include: {
          creator: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteNotification(id: string, userId: string) {
  return await db.notification.delete({ where: { id, receiverId: userId } });
}
