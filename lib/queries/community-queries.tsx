import { useInfiniteQuery, useQuery } from "react-query";
import { CommunityResponse, RecommendedCommunity } from "../api/validators";
import { PaginationResponse } from "../pagination";
import { usePaginatedQuery } from "./paginated-query";

/**
 * Fetches a community and their corresponding data given their slug
 * @param slug - The slug of the requested community
 * @returns - The community corresponding to the slug
 */
function useCommunityBySlug(slug: string) {
  return useQuery<CommunityResponse>(["community", slug], () =>
    fetch(`/api/communities/${slug}`).then((res) => res.json())
  );
}

function usePopularCommunities() {
  return usePaginatedQuery<CommunityResponse[]>(
    ["communities"],
    "/communities"
  );
}

export function useRecommendedCommunitiesQuery() {
  return useQuery<RecommendedCommunity[]>(["recommended-communities"], () =>
    fetch("/api/communities/recommended").then((res) => res.json())
  );
}

export { useCommunityBySlug, usePopularCommunities };
