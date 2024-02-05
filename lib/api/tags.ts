import { z } from "zod";
import { db } from "../db";
import { TagsValidators } from "./validators";

export async function getPopularTags(take = 4) {
  try {
    const result = await db.tags.findMany({
      orderBy: {
        communities: {
          _count: "asc",
        },
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
