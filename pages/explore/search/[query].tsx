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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { z } from "zod";

export default function SearchQuery({
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: communities } = useCommunitiesSearchResult(query);
  const { data: tags } = usePopularTags();
  const path = usePathname();

  return (
    <Layout heading="Explore">
      <Search defaultValue={query} />
      {JSON.stringify(path.split("/")[1])}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {typeof tags !== "undefined"
          ? tags.map(({ id, name }) => (
              <Link
                href={`/explore/search/${name}`}
                key={id}
                className={` w-full rounded-lg ${
                  name === query
                    ? "border-rose-500 text-rose-500 bg-rose-50"
                    : "bg-white text-slate-600 border-slate-300"
                } hover:border-rose-500 hover:text-rose-900 hover:bg-rose-50 p-4 border font-semibold`}
              >
                {name}
              </Link>
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
