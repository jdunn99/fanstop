import { CommunityCard } from "@/components/community-card";
import {
  DashboardItem,
  DashboardItemHeading,
  Layout,
} from "@/components/layout";
import { Search } from "@/components/search";
import Button from "@/components/ui/button";
import { usePopularCommunities } from "@/lib/queries/useCommunities";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import Link from "next/link";
import React from "react";

export default function ExplorePage() {
  const { data: tags } = usePopularTags();
  const { data: communities } = usePopularCommunities();

  return (
    <Layout heading="Explore">
      <Search />
      <div className="flex mx-auto items-center gap-2 justify-center w-full">
        {typeof tags !== "undefined"
          ? tags.map(({ id, name }) => (
              <Link href={`/explore/search/${name}`} key={id}>
                <Button type="button" variant="secondary" size="sm">
                  {name}
                </Button>
              </Link>
            ))
          : null}
      </div>
      {typeof communities !== "undefined" ? (
        <DashboardItem>
          <DashboardItemHeading heading="Popular Communities" />
          {communities.map(({ community, isOwn, isSubscriber }) => (
            <CommunityCard
              community={community}
              isOwn={isOwn}
              isSubscriber={isSubscriber}
              key={community.id}
            />
          ))}
        </DashboardItem>
      ) : null}
    </Layout>
  );
}
