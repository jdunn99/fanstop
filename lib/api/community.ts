import { db } from "@/lib/db";
import {
  CommunitiesValidators,
  Community,
  CommunityByIDQuery,
  CommunityResponse,
  CreateCommunityArgs,
} from "./validators";
import { z } from "zod";

export async function createCommunity({
  tags,
  creatorId,
  image,
  ...rest
}: CreateCommunityArgs): Promise<Community | null> {
  try {
    const result = await db.community.create({
      data: {
        ...rest,
        image,
        creatorId,
        tags: {
          connect: tags.map((id) => ({ id })),
        },
      },
    });

    if (!result) {
      throw new Error("Result does not exist.");
    }

    // update the user
    await db.user.update({
      where: {
        id: creatorId,
      },
      data: {
        image,
      },
    });

    return CommunitiesValidators.CommunitySchema.parse(result);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCommunityByParam({
  communityId: id,
}: CommunityByIDQuery): Promise<Community | null> {
  try {
    const result = await db.community.findFirst({
      // THIS WHERE QUERY WILL EVENTUALLY CHANGE
      where: { OR: [{ id }, { slug: id }, { creatorId: id }] },
      include: {
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
          select: {
            name: true,
            id: true,
            image: true,
          },
        },
      },
    });

    if (result === null) {
      throw new Error("Something went wrong.");
    }

    return CommunitiesValidators.CommunitySchema.parse(result);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSocialsForCommunity({
  communityId: id,
}: CommunityByIDQuery) {
  try {
    const result = await db.community.findFirst({
      where: { OR: [{ id }, { slug: id }, { creatorId: id }] },
      select: {
        facebook: true,
        instagram: true,
        tiktok: true,
        twitter: true,
        website: true,
      },
    });

    return CommunitiesValidators.CommunitySocialsSchema.parse(result);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function checkSubscriber({
  communityId,
  userId,
}: {
  communityId: string;
  userId: string;
}) {
  const result = await db.subscriber.count({
    where: {
      OR: [
        {
          communityId,
        },
        { community: { slug: communityId } },
      ],
      userId,
    },
  });

  console.log(result);

  return result > 0;
}

export async function getCommunitiesByTag(tagName: string, userId?: string) {
  try {
    const result = await db.community.findMany({
      where: {
        tags: {
          some: {
            name: tagName,
          },
        },
      },
      include: {
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
          select: {
            name: true,
            id: true,
            image: true,
          },
        },
      },
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
    });

    const validated = z
      .array(CommunitiesValidators.CommunitySchema)
      .parse(result);

    const response: CommunityResponse[] = [];

    for (const community of validated) {
      const isOwn =
        typeof userId !== "undefined" && community.creatorId === userId;

      if (isOwn) {
        continue;
      }

      response.push({
        isSubscriber:
          !isOwn &&
          typeof userId !== "undefined" &&
          (await checkSubscriber({ communityId: community.id, userId })),
        community,
        isOwn,
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPopularCommunities(query?: string, userId?: string) {
  try {
    const result = await db.community.findMany({
      where:
        typeof query !== "undefined"
          ? {
              name: {
                contains: query,
              },
            }
          : undefined,
      include: {
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
          select: {
            name: true,
            id: true,
            image: true,
          },
        },
      },
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
    });

    const validated = z
      .array(CommunitiesValidators.CommunitySchema)
      .parse(result);

    console.log({ result });
    const response: CommunityResponse[] = [];

    for (const community of validated) {
      const isOwn =
        typeof userId !== "undefined" && community.creatorId === userId;

      if (isOwn) {
        continue;
      }

      response.push({
        isSubscriber:
          !isOwn &&
          typeof userId !== "undefined" &&
          (await checkSubscriber({ communityId: community.id, userId })),
        community,
        isOwn,
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateCommunity({
  tags,
  id,
  creatorId,
  image,
  ...rest
}: Partial<CreateCommunityArgs> & { id: string }) {
  try {
    const { success } = z.object({ id: z.string().cuid() }).safeParse(id);
    const where = success
      ? {
          id,
        }
      : {
          slug: id,
        };

    let parsedTags: any | undefined = undefined;
    if (tags) {
      parsedTags = {
        set: tags.map((id) => ({ id })),
      };
    }

    return await db.community.update({
      where,
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
      include: {
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
          select: {
            name: true,
            id: true,
            image: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
