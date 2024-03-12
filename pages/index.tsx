import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { isAuthed } from "@/lib/authSSR";
import { CreateCommunity } from "@/components/create-community";
import { HomePage } from "@/components/home-page";
import { CreatePostButton } from "@/components/create-post-button";
import { LayoutHeader } from "@/components/layout/header";
import { NotificationMenu } from "@/components/notification-menu";
import { FeedPost } from "@/components/posts/feed-post";
import { FeedAside } from "@/components/sidebar/feed-aside";
import { useFeedQuery } from "@/lib/queries/post-queries";
import { Container } from "@/components/layout/container";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Empty } from "@/components/empty";

function FeedPage() {
  const { data } = useFeedQuery();

  return (
    <Container>
      <Sidebar />
      <div className="relative mx-auto overflow-auto flex w-full">
        <div className="relative min-h-screen pt-12 w-full max-w-screen-lg mx-auto px-4 break-words">
          <div>
            <LayoutHeader
              paths={[{ href: "/", disabled: true, value: "Home" }]}
            >
              <NotificationMenu />
              <CreatePostButton />
            </LayoutHeader>
            {data?.pages.map((page) =>
              page.response.length === 0 ? (
                <Empty
                  key={crypto.randomUUID()}
                  href="/explore"
                  buttonValue="Find Communities"
                  heading="Your feed is empty"
                >
                  Looks like you haven&apos;t subscribed to any communities. Any
                  new posts from those communities will be displayed here
                </Empty>
              ) : (
                page.response.map(({ post }) => (
                  <FeedPost post={post} includeAuthor key={post.id} />
                ))
              )
            )}
          </div>
        </div>
        <FeedAside />
      </div>
    </Container>
  );
}

export default function Home({
  data,
  hasCommunity,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return data ? (
    hasCommunity ? (
      <FeedPage />
    ) : (
      <CreateCommunity />
    )
  ) : (
    <HomePage />
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const { data, hasCommunity } = await isAuthed({ req, res });

  return {
    props: {
      data,
      hasCommunity,
    },
  };
}
