import React from "react";
import { BsGearFill } from "react-icons/bs";
import { CommunityResponse } from "@/lib/api/validators";
import { SubscribeButton, UnsubscribeButton } from "./subscribe-button";
import Link from "next/link";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";
import { usePostsForCommunity } from "@/lib/queries/post-queries";
import { Container } from "./layout/container";
import { LayoutHeader } from "./layout/header";
import { ProfileHeader } from "./profile/profile-header";
import Button from "./ui/button";
import { Sidebar } from "./sidebar/sidebar";

import Input from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FaSearch } from "react-icons/fa";
import { CreatePostButton } from "./create-post-button";
import { NotificationMenu } from "./notification-menu";
import { ProfileAside } from "./asides/profile-aside";
import { PostBottom } from "./posts/post-bottom";
import { Badge } from "./ui/badge";

interface ProfileComponentProps {
  slug: string;
  data?: CommunityResponse;
}

export function ProfileComponent({ data, slug }: ProfileComponentProps) {
  const { data: posts } = usePostsForCommunity(slug);
  const { data: socials } = useCommunitySocialsQuery(slug);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  if (!data || !posts) return null;

  const paths = [
    { href: "/", value: "Profile", disabled: true },
    { href: `/${data.community.slug}`, value: data.community.name },
  ];

  const { community, isOwn, isSubscriber } = data;

  return (
    <Container>
      <Sidebar />
      <div className="relative mx-auto overflow-auto flex w-full">
        <div className="relative min-h-screen pt-12 w-full max-w-screen-lg mx-auto px-4 break-words">
          <div>
            <LayoutHeader paths={paths}>
              {isOwn ? (
                <React.Fragment>
                  <NotificationMenu />
                  <CreatePostButton />
                  <Link href="/settings">
                    <Button className="inline-flex gap-2" variant="secondary">
                      <BsGearFill />
                      Edit Profile
                    </Button>
                  </Link>
                </React.Fragment>
              ) : isSubscriber ? (
                <UnsubscribeButton slug={slug} />
              ) : (
                <SubscribeButton slug={slug} />
              )}
            </LayoutHeader>

            <ProfileHeader community={community} socials={socials} />

            <div className="flex items-center gap-4 mt-16 mb-4 justify-between">
              {!isOpen ? (
                <h1 className="text-lg text-slate-800 font-semibold">
                  Recent Posts
                </h1>
              ) : null}

              <div className={`flex gap-2 ${isOpen && "flex-1"}`}>
                {isOpen ? (
                  <Input
                    className="flex-1"
                    autoFocus
                    placeholder="Search posts by title..."
                    onBlur={() => setIsOpen(false)}
                  />
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => setIsOpen(true)}
                    className="text-slate-700"
                  >
                    <FaSearch />
                  </Button>
                )}
                <Select>
                  <SelectTrigger className="w-32 truncate flex-shrink-0 flex gap-2 bg-slate-50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">All</SelectItem>
                    <SelectItem value="t">L:KJA:LKJS:LDKJAL:SKJD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {typeof posts === "undefined" ? null : (
              <div className="grid items-end grid-cols-2 lg:grid-cols-3 gap-8">
                {typeof posts !== "undefined"
                  ? posts.pages.map(({ response }) =>
                      response.map(({ post }) => (
                        <div className="grid grid-rows-2 gap-1" key={post.id}>
                          <img
                            className="w-full mb-4 bg-slate-50 max-h-48 object-contain rounded-lg flex-shrink-0"
                            src={post.image!}
                          />
                          <div className="grid">
                            <Link
                              href={`/${slug}/${post.id}`}
                              className="space-y-2 mt-4"
                            >
                              <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-slate-800">
                                  {post.title}
                                </h1>

                                {post.isPublished ? null : (
                                  <div>
                                    <Badge variant="secondary">
                                      Unpublished
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <p className=" text-slate-500  break-words mb-2">
                                {post.description}
                              </p>
                            </Link>

                            <p className="text-xs font-medium text-slate-600  truncate mb-2">
                              {new Date(post.createdAt).toDateString()}
                            </p>
                            <PostBottom {...post} />
                          </div>
                        </div>
                      ))
                    )
                  : null}
              </div>
            )}
          </div>
        </div>
        <ProfileAside />
      </div>
    </Container>
  );
}
