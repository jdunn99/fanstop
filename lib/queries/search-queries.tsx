import { useQuery } from "react-query";
import { usePaginatedQuery } from "./paginated-query";
import { CommunityResponse } from "../api/validators";

type ExploreResult = {
  tags: {
    name: string;
    id: string;
  }[];
  communities: {
    name: string;
    slug: string;
  }[];
};
function useExploreQuery(query?: string) {
  return useQuery<ExploreResult>(
    ["explore", query],
    () => fetch(`/api/search/explore?query=${query}`).then((res) => res.json()),
    {
      enabled: typeof query !== "undefined" && query.length > 2,
    }
  );
}

function useExploreResultsQuery(query: string) {
  return usePaginatedQuery<CommunityResponse[]>(
    ["communities-explore", query],
    `/search/communities/?query=${query}`
  );
}

export { useExploreQuery, useExploreResultsQuery };
