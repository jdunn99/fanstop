import { Community, CommunityResponse } from "@/lib/api/validators";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "./ui/button";
import { SubscribeButton } from "./subscribe-button";
import { Avatar } from "./ui/avatar";
import { ProfileImage } from "./ui/profile-image";

export function CommunityCard({
  community,
  isOwn,
  isSubscriber,
}: CommunityResponse) {
  const { data } = useSession();
  const { name, creator, description, slug, _count, image } = community;
  const { subscribers, posts } = _count;

  return (
    <div
      className="flex rounded-lg 
      border bg-slate-50 p-6 items-start hover:border-rose-400 cursor-pointer 
      hover:bg-rose-50"
    >
      <div className="mr-4">
        <ProfileImage src={creator.image!} />
      </div>
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
