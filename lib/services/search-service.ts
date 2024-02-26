// Search Context & function / schema definitions

import { z } from "zod";
import { db } from "../db";
import SearchQuery from "@/pages/explore/search/[query]";
import { PaginationSchema } from "../pagination";

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
};
