// Search Context & function / schema definitions

import { z } from "zod";
import { db } from "../db";
import SearchQuery from "@/pages/explore/search/[query]";
import { PaginationSchema } from "../pagination";
import { USER_WITH_IMAGE } from "./user-service";

export const SearchQuerySchema = z.object({
  query: z.string(),
});
export const SearchQueryWithPaginationSchema =
  SearchQuerySchema.merge(PaginationSchema);
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SearchQueryWithPagination = z.infer<
  typeof SearchQueryWithPaginationSchema
>;

export const SearchService = {
  getCommunityNames(query: string) {
    return db.community.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      select: {
        slug: true,
        name: true,
      },
      take: 5,
    });
  },

  getTagNames(query: string) {
    return db.tags.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  },

  getUserSearchResult(name: string, userId?: string) {
    return db.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
        OR: [
          {
            name: {
              contains: name,
            },
          },
          {
            community: {
              slug: {
                contains: name,
              },
            },
          },
        ],
      },
      select: {
        ...USER_WITH_IMAGE,
        community: {
          select: {
            slug: true,
          },
        },
        conversations: {
          where: {
            users: {
              some: {
                name: {
                  contains: name,
                },
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    });
  },
};
