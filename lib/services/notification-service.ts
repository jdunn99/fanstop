import { z } from "zod";
import { NotificationsValidators } from "../api/validators";
import { db } from "../db";
import { USER_WITH_IMAGE } from "./user-service";

interface CreateNotificationArgs {
  receiver: string;
  creator: string;
  message: string;
  path: string;
}

export const NotificationService = {
  createNotification({
    receiver,
    creator,
    message,
    path,
  }: CreateNotificationArgs) {
    return db.notification.create({
      data: {
        message,
        receiverId: receiver,
        creatorId: creator,
        path,
      },
    });
  },
  async getNotificationsForUser(userId: string) {
    return z.array(NotificationsValidators.NotifcationSchema).parse(
      await db.notification.findMany({
        where: {
          receiverId: userId,
        },
        include: {
          creator: {
            select: USER_WITH_IMAGE,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );
  },
};
