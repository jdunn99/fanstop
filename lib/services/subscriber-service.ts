import { User } from "next-auth";
import { db } from "../db";
import {
  PaginationArgs,
  getPaginatedMetadata,
  paginationArgs,
} from "../pagination";
import { USER_WITH_IMAGE } from "./user-service";

type SubscriberQuery = {
  user: User & {
    id: string;
    slug: string;
  };
  slug: string;
};

export const SubscriberService = {
  /**
   * Checks if a requested user is subscribed to a community
   */
  async checkSubscriber({ slug, userId }: { slug: string; userId: string }) {
    const result = await db.subscriber.count({
      where: {
        community: {
          slug,
        },
        userId,
      },
    });

    return result > 0;
  },

  async getSubscriptionsForUser(
    userId: string,
    { take, cursor }: PaginationArgs
  ) {
    const result = await db.subscriber.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        community: {
          select: {
            slug: true,
            name: true,
            image: true,
          },
        },
      },
      ...paginationArgs({ cursor, take }),
    });

    if (!result) {
      throw new Error("Something went wrong fetching subscribers.");
    }

    const { hasMore, cursor: newCursor } = getPaginatedMetadata(
      result as any,
      take
    );

    return {
      response: result,
      cursor: newCursor,
      hasMore,
    };
  },

  /**
   * Subscribes an authenticated user to a community
   * Creates a notification
   * @param slug - The slug of the community
   * @param userId - The ID of the authenticated user
   */
  async subscribeToCommunity({ user, slug }: SubscriberQuery) {
    if (user.slug === slug) {
      throw new Error("Cannot subscribe to yourself!");
    }

    // Create the subscription
    const result = await db.subscriber.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        community: {
          connect: {
            slug,
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

    if (result === null) {
      throw new Error("Something went wrong creating the subscription");
    }

    // Create the notification
    await db.notification.create({
      data: {
        message: `${user.name} subscribed to your community`,
        path: `/${result.user.community!.slug}`,
        creatorId: user.id,
        receiverId: result.community.creatorId,
      },
    });

    return result;
  },

  async deleteSubscription(slug: string, userId: string) {
    const subscription = await db.subscriber.findFirst({
      where: {
        userId,
        community: {
          slug,
        },
      },
    });

    if (!subscription) {
      throw new Error("Not found");
    }

    await db.subscriber.delete({
      where: {
        id: subscription.id,
      },
    });
  },
};
