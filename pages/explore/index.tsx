import { CommunityCard } from "@/components/community-card";
import { DashboardItem, DashboardItemHeading } from "@/components/layout";
import { Container } from "@/components/layout/container";
import { Content, LayoutPane } from "@/components/layout/content";
import { LayoutHeader } from "@/components/layout/header";
import { Search } from "@/components/search";
import { Sidebar } from "@/components/sidebar/sidebar";
import Button from "@/components/ui/button";
import { usePopularCommunities } from "@/lib/queries/community-queries";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import Link from "next/link";
import React from "react";

export default function ExplorePage() {
  const { data: tags } = usePopularTags();
  const { data: communities } = usePopularCommunities();

  return (
    <Container>
      <Sidebar />
      <LayoutPane>
        <LayoutHeader
          paths={[{ href: "/explore", value: "Explore", disabled: true }]}
        />
        <Search />
        <div className="flex mx-auto items-center gap-2 justify-center w-full mt-4">
          {typeof tags !== "undefined"
            ? tags.map(({ id, name }) => (
                <Link href={`/explore/search/${name}`} key={id}>
                  <Button type="button" variant="white" size="sm">
                    {name}
                  </Button>
                </Link>
              ))
            : null}
        </div>
        <div className="mt-8">
          <h1 className="text-lg mb-4 font-semibold text-slate-800">
            Popular Communities
          </h1>
          {typeof communities !== "undefined"
            ? communities.pages.map(({ response }) =>
                response.map(({ community, isOwn, isSubscriber }) => (
                  <CommunityCard
                    community={community}
                    isOwn={isOwn}
                    isSubscriber={isSubscriber}
                    key={community.id}
                  />
                ))
              )
            : null}
        </div>
      </LayoutPane>
    </Container>
  );
}
