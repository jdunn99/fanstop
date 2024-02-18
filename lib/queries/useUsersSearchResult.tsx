import { useQuery } from "react-query";
import { UserSearchResult } from "../api/validators";

export function useUsersSearchResult(query: string) {
  return useQuery<UserSearchResult[]>(
    ["users", query],
    () => fetch(`/api/user/search?query=${query}`).then((res) => res.json()),
    {
      enabled: query.length > 0,
    }
  );
}
