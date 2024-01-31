import { CommunityProfile } from "@/pages/api/communities/[communityId]";
import { CommunityByTag } from "@/pages/api/tags/[tagId]/communities";
import { Community } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CommunityResponse } from "../api/validators";

export function useCommunitiesQuery() {
  return useQuery<any[]>("communities", () =>
    fetch(`/api/communities`).then((result) => result.json())
  );
}

export function useCommunitiesByIDQuery(slug: string) {
  return useQuery<any>(["community", slug], () =>
    fetch(`/api/communities/${slug}`).then((res) => res.json())
  );
}

export function useCommunitiesForProfile() {
  const { data: session } = useSession();
  return useQuery<any>([session?.user.id], () =>
    fetch(`/api/user/communities`).then((res) => res.json())
  );
}

export function useCommunitiesByParamQuery(slug: string) {
  return useQuery<CommunityResponse>(["community", slug], () =>
    fetch(`/api/communities/${slug}`).then((res) => res.json())
  );
}
