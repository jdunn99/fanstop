import { Community, CommunityResponse } from "@/lib/api/validators";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "./ui/button";
import { SubscribeButton } from "./subscribe-button";
import { Avatar } from "./ui/avatar";

export function CommunityCard({
  community,
  isOwn,
  isSubscriber,
}: CommunityResponse) {
  const { data } = useSession();
  const { name, creator, description, slug, _count } = community;
  const { subscribers, posts } = _count;

  return (
    <div
      className="flex rounded-lg 
      border bg-white p-6 items-start hover:border-rose-400 cursor-pointer 
      hover:bg-rose-50"
    >
      <Avatar className="w-16 h-16 rounded-lg mr-4 bg-rose-500 inline-flex items-center justify-center text-white font-bold text-xl text-center">
        {community.name.at(0)}
      </Avatar>
      <Link
        className="flex flex-1 flex-col justify-between rounded-md "
        href={`/${slug}`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-bold text-lg">{name}</h3>
              <span className="text-rose-500 font-semibold text-sm">
                @{slug}
              </span>
            </div>
          </div>
          <p className="text-sm opacity-80">{description}</p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-slate-600 font-bold">{subscribers}</p>
              <p className="text-slate-600 text-xs">Subscribers</p>
            </div>
            <div>
              <p className="text-slate-600 font-bold">{posts}</p>
              <p className="text-slate-600 text-xs">Posts</p>
            </div>
          </div>
        </div>
      </Link>

      {data !== null ? (
        isOwn ? (
          <Button size="sm">Edit Profile</Button>
        ) : (
          <SubscribeButton slug={slug} isSubscriber={isSubscriber} />
        )
      ) : null}
    </div>
  );
}
