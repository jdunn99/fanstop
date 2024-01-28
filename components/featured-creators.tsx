import { CommunityByTag } from "@/pages/api/tags/[tagId]/communities";
import Link from "next/link";
import { MdMap } from "react-icons/md";
import { useQuery } from "react-query";
import Button from "./ui/button";
import { CommunityCard } from "./community-card";

interface FeaturedCreatorProps {
  queryKey: string;
}

type FeaturedCreator = {
  id: string;
  name: string;
  description: string;
};

export function FeaturedCreatorItem() {}

export function FeaturedCreator({ queryKey }: FeaturedCreatorProps) {
  const { data, isLoading } = useQuery<CommunityByTag[]>(
    ["Featured-Creators", queryKey],
    () => fetch(`/api/tags/${queryKey}/communities`).then((res) => res.json())
  );

  if (isLoading) return null;

  if (typeof data === "undefined") return null;

  if (data.length === 0)
    return (
      <div className="w-full mx-auto">
        <div className="py-4 text-center font-semibold text-slate-500">
          <p>No communities yet!</p>
        </div>
      </div>
    );

  return data.map((community) => (
    <CommunityCard {...community} key={community.id} />
  ));
}
