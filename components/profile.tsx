import React from "react";
import { BsGearFill } from "react-icons/bs";
import { Layout, DashboardItem, DashboardItemHeading } from "./layout";
import { PostComponent } from "./posts/post-item";
import { CommunityResponse } from "@/lib/api/validators";
import { SubscribeButton } from "./subscribe-button";
import { ProfileImage } from "./ui/profile-image";
import Link from "next/link";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";
import { usePostsForCommunity } from "@/lib/queries/post-queries";
import { Container } from "./layout/container";
import { Sidebar } from "./layout/sidebar";
import { Content, LayoutPane } from "./layout/content";
import { LayoutHeader } from "./layout/header";
import { ProfileHeader } from "./profile/profile-header";
import Button from "./ui/button";

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
          {isOwn ? (
            <div className="flex items-center gap-2 font-semibold">
              <Link href="/settings">
                <Button className="inline-flex gap-2" variant="secondary">
                  <BsGearFill />
                  Edit Profile
                </Button>
              </Link>
            </div>
          ) : (
            <SubscribeButton isSubscriber={isSubscriber} slug={slug} />
          )}
        </LayoutHeader>
        <Content>
          <ProfileHeader community={community} socials={socials} />

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
                      ))
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
