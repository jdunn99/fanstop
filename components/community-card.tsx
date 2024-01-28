import { CommunityByTag } from "@/pages/api/tags/[tagId]/communities";
import Link from "next/link";

export function CommunityCard({
  id,
  slug,
  name,
  creator,
  description,
}: CommunityByTag) {
  return (
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
  );
}
