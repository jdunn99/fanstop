import React from "react";
import { BsGearFill } from "react-icons/bs";
import { Layout, DashboardItem, DashboardItemHeading } from "./layout";
import { PostComponent } from "./posts/post-item";
import Button from "./ui/button";
import { CommunityResponse } from "@/lib/api/validators";
import { SubscribeButton } from "./subscribe-button";
import { ProfileImage } from "./ui/profile-image";
import Link from "next/link";
import { Socials } from "./socials";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";
import { ProfileControls } from "./profile-controls";
import { usePostsForCommunity } from "@/lib/queries/post-queries";
import { Container } from "./layout/container";
import { Sidebar } from "./layout/sidebar";
import { Content, LayoutPane } from "./layout/content";
import { ResizableHandle } from "./ui/resizable";
import { LayoutHeader } from "./layout/header";

interface ProfileComponentProps {
  slug: string;
  data?: CommunityResponse;
}

export function ProfileComponent({ data, slug }: ProfileComponentProps) {
  const { data: posts } = usePostsForCommunity(slug);
  const { data: socials } = useCommunitySocialsQuery(slug);

  if (!data) return null;
  const paths = [
    { href: "/", value: "Profile", disabled: true },
    { href: `/${data.community.slug}`, value: data.community.name },
  ];

  const { community, isOwn, isSubscriber } = data;

  return (
    <Container>
      <Sidebar />
      <LayoutPane>
        <LayoutHeader paths={paths}>
          <p>Hi</p>
          {isOwn ? (
            <div className="flex items-center gap-2 font-semibold">
              <Link href="/settings">
                <Button size="sm" variant="ghost">
                  <BsGearFill />
                </Button>
              </Link>
            </div>
          ) : (
            <SubscribeButton isSubscriber={isSubscriber} slug={slug} />
          )}
        </LayoutHeader>
        <Content>
          <div className="w-full space-y-8 mx-auto max-w-screen-md text-center">
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

          {typeof posts === "undefined" ? null : (
            <React.Fragment>
              <DashboardItem>
                {typeof posts !== "undefined"
                  ? posts.pages.map(({ response }) =>
                      response.map(({ post, isAuthor }) => (
                        <PostComponent
                          key={post.id}
                          {...post}
                          isOwn={isAuthor}
                        />
                      )),
                    )
                  : null}
              </DashboardItem>
            </React.Fragment>
          )}
        </Content>
      </LayoutPane>
    </Container>
  );
}
