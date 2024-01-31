import { db } from "@/lib/db";
import {
  CommunitiesValidators,
  Community,
  CommunityByIDQuery,
  CommunityResponse,
  CreateCommunityArgs,
} from "./validators";

export async function createCommunity({
  tags,
  ...rest
}: CreateCommunityArgs): Promise<Community | null> {
  try {
    const result = await db.community.create({
      data: {
        ...rest,
        tags: {
          connect: tags.map((id) => ({ id })),
        },
      },
    });

    if (!result) {
      throw new Error("Result does not exist.");
    }

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

export async function checkSubscriber({
  communityId,
  userId,
}: {
  communityId: string;
  userId: string;
}) {
  const result = await db.subscriber.count({
    where: {
      communityId,
      userId,
    },
  });

  return result > 0;
}
