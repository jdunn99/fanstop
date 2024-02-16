import { DefaultUser, User } from "next-auth";
import { db } from "../db";

type SubscriberQuery = {
  user: User & {
    id: string;
    slug: string;
  };
  communityId: string;
};

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

export async function subscribeToCommunity({
  user,
  communityId,
}: SubscriberQuery) {
  try {
    console.log(user);
    const subscription = await db.subscriber.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        community: {
          connect: {
            slug: communityId,
          },
        },
      },
      include: {
        community: {
          select: {
            creatorId: true,
          },
        },
        user: {
          select: {
            community: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    if (subscription === null) {
      throw new Error("Something went wrong creating the subscription");
    }

    const n = await db.notification.create({
      data: {
        message: `${user.name} subscribed to your community`,
        path: `/${subscription.user.community!.slug}`,
        creatorId: user.id,
        receiverId: subscription.community.creatorId,
      },
    });

    console.log(n);

    return subscription;
  } catch (error) {
    console.error(error);
    return null;
  }
}
