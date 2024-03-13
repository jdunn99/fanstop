import {
  Community,
  CommunityResponse,
  Socials as ProfileSocials,
} from "@/lib/api/validators";
import { Socials } from "../socials";
import { ProfileImage } from "../ui/profile-image";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";
import React from "react";
import Link from "next/link";
import { BsGearFill } from "react-icons/bs";
import { CreatePostButton } from "../create-post-button";
import { LayoutHeader } from "../layout/header";
import { NotificationMenu } from "../notification-menu";
import { UnsubscribeButton, SubscribeButton } from "../subscribe-button";
import Button from "../ui/button";

interface ProfileHeaderProps extends CommunityResponse {
  socials?: ProfileSocials;
}

export function ProfileHeader({
  community,
  isOwn,
  isSubscriber,
}: ProfileHeaderProps) {
  const { data: socials } = useCommunitySocialsQuery(community.slug);
  const paths = [
    { href: "/", value: "Profile", disabled: true },
    { href: `/${community.slug}`, value: community.name },
  ];

  return (
    <React.Fragment>
      <LayoutHeader paths={paths}>
        {isOwn ? (
          <React.Fragment>
            <NotificationMenu />
            <CreatePostButton />
            <Link href="/settings/general">
              <Button className="inline-flex gap-2" variant="secondary">
                <BsGearFill />
                Edit Profile
              </Button>
            </Link>
          </React.Fragment>
        ) : isSubscriber ? (
          <UnsubscribeButton slug={community.slug} />
        ) : (
          <SubscribeButton slug={community.slug} />
        )}
      </LayoutHeader>
      <div className="w-full space-y-8 mx-auto text-center p-4">
        <div className="flex justify-end"></div>
        {community.image ? <ProfileImage src={community.image} /> : null}
        <h1 className="text-center text-4xl font-bold  text-slate-800 dark:text-slate-200">
          {community.name}
        </h1>
        <p className="w-full text-center  font-regular text-slate-500 leading-loose dark:text-slate-400">
          {community.description}
        </p>
        <div className="flex justify-center">
          <div className="dark:text-slate-300 flex items-center gap-2 font-semibold text-slate-600 text-sm sm:flex-row flex-col ">
            <p>{community._count.subscribers} subscribers</p>
            <p>{community._count.posts} posts</p>
          </div>
        </div>
        {typeof socials !== "undefined" ? <Socials {...socials} /> : null}
      </div>
    </React.Fragment>
  );
}
