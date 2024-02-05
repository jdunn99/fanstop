import { CommunityCard } from "@/components/community-card";
import {
  DashboardItem,
  DashboardItemHeading,
  Layout,
} from "@/components/layout";
import { Search } from "@/components/search";
import { usePopularCommunities } from "@/lib/queries/useCommunities";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import React from "react";

export default function ExplorePage() {
  // const { data: communities, isLoading } = useCommunitiesQuery();
  const { data: tags } = usePopularTags();
  const { data: communities } = usePopularCommunities();

  return (
    <Layout heading="Explore">
      <Search />
      <div className="grid grid-cols-4 gap-2">
        {typeof tags !== "undefined"
          ? tags.map(({ id, name }) => (
              <div
                key={id}
                className="rounded-lg bg-white p-4 border border-slate-300 text-slate-600 font-semibold"
              >
                {name}
              </div>
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
