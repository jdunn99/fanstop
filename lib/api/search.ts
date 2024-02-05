import { db } from "../db";

const SEARCH_OPTIONS = {
  select: {
    id: true,
    name: true,
  },
  take: 6,
};

async function getTagsByQuery(query: string) {
  return await db.tags.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    ...SEARCH_OPTIONS,
  });
}

async function getCommunitiesByQuery(query: string) {
  return await db.community.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    ...SEARCH_OPTIONS,
    select: {
      ...SEARCH_OPTIONS["select"],
      slug: true,
    },
  });
}

type SearchQueryResult = {
  name: string;
  id: string;
};
export type SearchResult = {
  query: string;
  tags: SearchQueryResult[];
  communities: Array<SearchQueryResult & { slug: string }>;
};

export async function getSearchResult(
  query: string
): Promise<SearchResult | null> {
  try {
    const tags = await getTagsByQuery(query);
    const communities = await getCommunitiesByQuery(query);

    return { query, tags, communities };
  } catch (error) {
    console.error(error);
    return null;
  }
}
