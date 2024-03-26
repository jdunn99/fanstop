import { useSession } from "next-auth/react";
import { useInfiniteQuery } from "react-query";
import { usePaginatedQuery } from "./paginated-query";

export function useSubscriptionsForUserQuery() {
  const { data: session } = useSession();

  return usePaginatedQuery<any>(["subscriptions"], "/user/subscriptions", {
    enabled: session !== null && typeof session !== "undefined",
  });
}
