import { QueryOptions, useInfiniteQuery } from "react-query";
import { PaginationResponse } from "../pagination";

async function fetchPaginatedResults({
  pageParam,
  path,
}: {
  pageParam: any;
  path: string;
}) {
  const query =
    typeof pageParam !== "undefined"
      ? `${path.includes("?") ? "&" : "?"}cursor=${pageParam}`
      : "";
  const res = await fetch(`/api/${path}${query}`);
  return await res.json();
}

/**
 * Generic function that fetches paginated data given a path
 * @param queryKey - The React-Query key used for caching
 * @param path - The API route for fetching data
 * @returns - The requested paginated data
 */
export function usePaginatedQuery<T extends {}>(
  queryKey: any,
  path: string,
  options?: any
) {
  return useInfiniteQuery<PaginationResponse<T>>({
    queryKey,
    queryFn: async ({ pageParam }) =>
      await fetchPaginatedResults({ pageParam, path }),
    getNextPageParam: ({ cursor }) => {
      return cursor;
    },
    ...options,
  });
}
