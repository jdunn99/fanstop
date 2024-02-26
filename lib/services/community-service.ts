import {
  CommunitiesValidators,
  Community,
  CommunityResponse,
  CreateCommunityArgs,
} from "../api/validators";
import { db } from "../db";
import {
  PaginationArgs,
  PaginationResponse,
  getPaginatedMetadata,
  paginationArgs,
} from "../pagination";
import { SubscriberService } from "./subscriber-service";
import { USER_WITH_IMAGE } from "./user-service";

const COMMUNITY_INCLUDE = {
  _count: {
    select: {
      subscribers: true,
      posts: {
        where: {
          isPublished: true,
        },
      },
    },
  },
  creator: {
    select: USER_WITH_IMAGE,
  },
};

export async function getCommunityMetadata(
  community: Community,
  userId?: string
) {
  const isOwn = typeof userId !== "undefined" && community.creatorId === userId;
  const isSubscriber =
    !isOwn &&
    typeof userId !== "undefined" &&
    (await SubscriberService.checkSubscriber({
      slug: community.slug,
      userId,
    }));

  return {
    isSubscriber,
    isOwn,
  };
}

async function buildCommunityResponse(
  communities: Community[],
  userId?: string,
  take?: number
): Promise<PaginationResponse<CommunityResponse[]>> {
  const response: CommunityResponse[] = [];
  const { hasMore, cursor } = getPaginatedMetadata(communities as any, take);

  for (const community of communities) {
    const { isOwn, isSubscriber } = await getCommunityMetadata(
      community,
      userId
    );

    if (isOwn) {
      continue;
    }

    response.push({
      isSubscriber,
      community,
      isOwn,
    });
  }

  return {
    hasMore,
    cursor,
    response,
  };
}

export const CommunityService = {
  async getCommunities({
    query,
    take,
    userId,
    cursor,
  }: PaginationArgs & {
    query?: string;
    userId?: string;
  }) {
    const result = await db.community.findMany({
      where:
        typeof query !== "undefined"
          ? {
              name: {
                contains: query,
              },
            }
          : undefined,
      include: COMMUNITY_INCLUDE,
      ...paginationArgs({ take, cursor }),
      orderBy: {
        subscribers: {
          _count: "asc",
        },
      },
    });

    return buildCommunityResponse(
      CommunitiesValidators.CommunitySchema.array().parse(result),
      userId
    );
  },

  async createCommunity({
    tags,
    creatorId,
    image,
    ...rest
  }: CreateCommunityArgs & {
    creatorId: string;
  }): Promise<Community> {
    const community = await db.community.create({
      data: {
        ...rest,
        image,
        creatorId,
        tags: {
          connect: tags.map((id) => ({ id })),
        },
      },
    });

    await db.user.update({
      where: {
        id: creatorId,
      },
      data: {
        image,
      },
    });

    return CommunitiesValidators.CommunitySchema.parse(community);
  },

  async getCommunityBySlug({
    slug,
    userId,
  }: Pick<Community, "slug"> & {
    userId?: string;
  }) {
    const result = await db.community.findFirst({
      where: {
        slug,
      },
      include: COMMUNITY_INCLUDE,
    });

    const community = CommunitiesValidators.CommunitySchema.parse(result);
    const { isOwn, isSubscriber } = await getCommunityMetadata(
      community,
      userId
    );

    return { isOwn, isSubscriber, community };
  },

  async getSocialsForCommunity({ slug }: Pick<Community, "slug">) {
    const result = await db.community.findFirst({
      where: {
        slug,
      },
      select: {
        facebook: true,
        instagram: true,
        tiktok: true,
        twitter: true,
        website: true,
      },
    });

    return CommunitiesValidators.CommunitySocialsSchema.parse(result);
  },

  async getCommunitiesByTag(tagName: string, userId?: string) {
    const result = await db.community.findMany({
      where: {
        tags: {
          some: {
            name: tagName,
          },
        },
      },
      include: COMMUNITY_INCLUDE,
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
    });

    const validated =
      CommunitiesValidators.CommunitySchema.array().parse(result);

    return buildCommunityResponse(validated, userId);
  },

  updateCommunity({
    tags,
    slug,
    image,
    ...rest
  }: Partial<CreateCommunityArgs> & {
    slug: string;
  }) {
    let parsedTags: any | undefined = undefined;
    if (tags) {
      parsedTags = {
        set: tags.map((id) => ({ id })),
      };
    }

    return db.community.update({
      where: {
        slug,
      },
      data: {
        tags: parsedTags,
        creator: {
          update: {
            image,
          },
        },
        image,
        ...rest,
      },
      include: COMMUNITY_INCLUDE,
    });
  },
};
