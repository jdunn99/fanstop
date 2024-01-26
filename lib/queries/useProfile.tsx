import { Profile } from "@/pages/api/communities/[communityId]/profile";
import { useQuery } from "react-query";

export function useProfileQuery(id: string) {
  return useQuery<Profile>(["profile"], () =>
    fetch(`/api/communities/${id}/profile`).then((res) => res.json())
  );
}
