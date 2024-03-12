import { useSession } from "next-auth/react";
import { Group } from "../api/validators";
import { usePaginatedQuery } from "./paginated-query";

function useGroupsForCommunity(slug: string) {
  return usePaginatedQuery<Group[]>(
    ["community-groups", slug],
    `/communities/${slug}/groups`
  );
}

function useGroupsForAuthedUser() {
  const { data: session } = useSession();

  return usePaginatedQuery<Group[]>(
    ["community-groups", session?.user.slug],
    `/communities/${session?.user.slug}/groups`,
    {
      enabled: session !== null,
    }
  );
}

export { useGroupsForCommunity, useGroupsForAuthedUser };
