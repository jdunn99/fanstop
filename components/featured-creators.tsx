import { CommunityByTag } from "@/pages/api/tags/[tagId]/communities";
import Link from "next/link";
import { MdMap } from "react-icons/md";
import { useQuery } from "react-query";
import Button from "./ui/button";

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

  return data.map(({ slug, creator, id, name, description }) => (
    <Link className="mx-1" key={id} href={`/${slug}`}>
      <div
        key={id}
        className="relative overflow-hidden rounded-lg 
      border bg-white p-2 hover:border-rose-400 cursor-pointer 
      hover:bg-rose-50"
      >
        <div className="flex flex-col justify-between rounded-md p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="font-bold text-lg">{name}</h3>
                <span className="text-rose-500 font-semibold text-sm">
                  {creator.name}
                </span>
              </div>
            </div>
            <p className="text-sm opacity-80">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  ));
}
