import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import {
  useCommunitiesByIDQuery,
  useCommunitiesByParamQuery,
} from "@/lib/queries/useCommunities";
import { ProfileComponent } from "@/components/profile";
import { useSession } from "next-auth/react";
import { DashboardItem } from "@/components/layout";
import { LayoutPane } from "@/components/layout/content";
import { LayoutHeader } from "@/components/layout/header";
import { PostComponent } from "@/components/posts/post-item";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SubscribeButton } from "@/components/subscribe-button";
import Button from "@/components/ui/button";
import { usePostsForCommunity } from "@/lib/queries/post-queries";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";
import { Content } from "@radix-ui/react-dialog";
import { Sidebar, Link } from "lucide-react";
import { Container } from "@/components/layout/container";
import React from "react";
import { BsGearFill } from "react-icons/bs";
import { ProfilePosts } from "@/components/profile/profile-posts";

export default function Profile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByParamQuery(user.id);

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
            <SubscribeButton
              isSubscriber={isSubscriber}
              slug={community.slug}
            />
          )}
        </LayoutHeader>
        <Content>
          <ProfileHeader community={community} />
          <ProfilePosts slug={community.slug} />
        </Content>
      </LayoutPane>
    </Container>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (session === null) {
    return {
      redirect: "/login",
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}
