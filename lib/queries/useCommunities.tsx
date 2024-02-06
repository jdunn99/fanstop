import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import {
  Community,
  CommunityResponse,
  CommunitySearchResult,
} from "../api/validators";

export function useCommunitiesQuery() {
  return useQuery<any[]>("communities", () =>
    fetch(`/api/communities`).then((result) => result.json())
  );
}

export function useCommunitiesByIDQuery(slug: string) {
  return useQuery<CommunityResponse>(["community", slug], () =>
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

export function usePopularCommunities() {
  return useQuery<CommunityResponse[]>(["popular-communities"], () =>
    fetch("/api/communities/popular").then((res) => res.json())
  );
}

export function useCommunitiesSearchResult(query: string) {
  return useQuery<CommunitySearchResult>(["communities-search"], () =>
    fetch(`/api/tags/${query}/communities`).then((res) => res.json())
  );
}
