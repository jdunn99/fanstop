import { GroupArgs } from "../api/validators";
import { db } from "../db";
import {
  PaginationArgs,
  getPaginatedMetadata,
  paginationArgs,
} from "../pagination";

export const GroupService = {
  createGroup(
    args: GroupArgs & {
      userId: string;
    }
  ) {
    const { userId, ...rest } = args;
    return db.group.create({
      data: {
        community: {
          connect: {
            creatorId: args.userId,
          },
        },
        ...rest,
      },
    });
  },

  deleteGroup(name: string, creatorId: string) {
    return db.group.delete({
      where: {
        name,
        community: {
          creatorId,
        },
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
