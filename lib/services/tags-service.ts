import { Prisma } from "@prisma/client";
import { db } from "../db";

export const TagsService = {
  /**
   * Gets a list of tags that a community uses
   * @param slug - The slug of the community
   */
  async getTags(where: Prisma.TagsWhereInput) {
    return db.tags.findMany({
      where,
    });
  },
};
