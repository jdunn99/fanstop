import { Community, CommunityResponse } from "@/lib/api/validators";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "./ui/button";
import { SubscribeButton } from "./subscribe-button";

export function CommunityCard({
  community,
  isOwn,
  isSubscriber,
}: CommunityResponse) {
  const { data } = useSession();
  const { name, creator, description, slug, _count } = community;
  const { subscribers } = _count;

  return (
    <div
      className="flex rounded-lg 
      border bg-white p-6 hover:border-rose-400 cursor-pointer 
      hover:bg-rose-50"
    >
      <div className="flex flex-1 flex-col justify-between rounded-md ">
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
