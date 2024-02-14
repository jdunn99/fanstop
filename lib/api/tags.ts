import { z } from "zod";
import { db } from "../db";
import { TagsValidators } from "./validators";

export async function getPopularTags(take = 4) {
  try {
    const result = await db.tags.findMany({
      orderBy: {
        name: "asc",
      },
      take,
    });
    return z.array(TagsValidators.Tag).parse(result);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function isTag(name: string) {
  return await db.tags.findFirst({
    where: {
      name: {
        startsWith: name,
      },
    },
  });
}

export async function getTagsForCommunity(communityId: string) {
  try {
    const result = await db.community.findFirst({
      where: {
        slug: communityId,
      },
      select: {
        tags: true,
      },
    });

    if (result === null) {
      throw new Error("communtiy not found");
    }

    return result.tags;
  } catch (error) {
    console.error(error);
    return null;
  }
}
