import { db } from "../db";

export async function getSubscriptionsForUser(userId: string) {
  try {
    const result = await db.subscriber.findMany({
      where: {
        userId,
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
