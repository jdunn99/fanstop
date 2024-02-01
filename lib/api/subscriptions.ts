import { db } from "../db";

type SubscriberQuery = {
  userId: string;
  communityId: string;
};

export async function getSubscriptionsForUser(userId: string) {
  try {
    const result = await db.subscriber.findMany({
      where: {
        userId,
      },
    });

    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function subscribeToCommunity({
  userId,
  communityId,
}: SubscriberQuery) {
  try {
    return await db.subscriber.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        community: {
          connect: {
            slug: communityId,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
