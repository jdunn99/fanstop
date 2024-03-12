import { GroupArgs } from "../api/validators";
import { db } from "../db";
import {
  PaginationArgs,
  getPaginatedMetadata,
  paginationArgs,
} from "../pagination";

export const GroupService = {
  createGroup(
    slug: string,
    args: GroupArgs & {
      userId: string;
    }
  ) {
    const { userId, ...rest } = args;
    return db.group.create({
      data: {
        community: {
          connect: {
            slug,
            creatorId: args.userId,
          },
        },
        ...rest,
      },
    });
  },

  async getGroupsForCommunity(slug: string, args: PaginationArgs) {
    const result = await db.group.findMany({
      where: {
        community: {
          slug,
        },
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },

      ...paginationArgs(args),
    });

    const { take } = args;
    const { cursor, hasMore } = getPaginatedMetadata(result, take);

    return {
      response: result,
      hasMore,
      cursor,
    };
  },
};
