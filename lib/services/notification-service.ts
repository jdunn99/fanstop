import { z } from "zod";
import { NotificationsValidators } from "../api/validators";
import { db } from "../db";
import { USER_WITH_IMAGE } from "./user-service";

export const NotificationService = {
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
      })
    );
  },
};
