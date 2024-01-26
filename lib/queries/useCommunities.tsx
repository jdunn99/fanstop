import { CommunityProfile } from "@/pages/api/communities/[communityId]";
import { Community } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

export function useCommunitiesQuery() {
  return useQuery<Community[]>("communities", () =>
    fetch(`/api/communities`).then((result) => result.json())
  );
}

export function useCommunitiesByIDQuery(slug: string) {
  return useQuery<CommunityProfile>([slug], () =>
    fetch(`/api/communities/${slug}`).then((res) => res.json())
  );
}

export function useCommunitiesForProfile() {
  const { data: session } = useSession();
  return useQuery<Community>([session?.user.id], () =>
    fetch(`/api/user/communities`).then((res) => res.json())
  );
}
