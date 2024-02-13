import { useQuery } from "react-query";
import { Socials } from "../api/validators";

export function useCommunitySocialsQuery(id: string) {
  return useQuery<Socials>(["community-socials", id], () =>
    fetch(`/api/communities/${id}/socials`).then((res) => res.json())
  );
}
