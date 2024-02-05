import { CommunityCard } from "@/components/community-card";
import {
  Layout,
  DashboardItem,
  DashboardItemHeading,
} from "@/components/layout";
import { Search } from "@/components/search";
import { CommunitySearchResult } from "@/lib/api/validators";
import {
  useCommunitiesSearchResult,
  usePopularCommunities,
} from "@/lib/queries/useCommunities";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import communities from "@/pages/api/communities";
import tags from "@/pages/api/tags";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { z } from "zod";

export default function SearchQuery({
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: tags } = usePopularTags();
  const { data: communities } = useCommunitiesSearchResult(query);

  return (
    <Layout heading="Explore">
      <Search defaultValue={query} />
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
          {communities.result.length > 0 ? (
            <React.Fragment>
              <DashboardItemHeading heading="Popular Communities" />
              {communities.result.map(({ community, isOwn, isSubscriber }) => (
                <CommunityCard
                  community={community}
                  isOwn={isOwn}
                  isSubscriber={isSubscriber}
                  key={community.id}
                />
              ))}
            </React.Fragment>
          ) : (
            <p className="p-16 text-center text-sm text-slate-500">
              No communities found for <strong>{query}</strong>
            </p>
          )}
        </DashboardItem>
      ) : null}
    </Layout>
  );
}

export async function getServerSideProps(req: GetServerSidePropsContext) {
  const query = z.string().parse(req.query.query);

  return {
    props: {
      query,
    },
  };
}
