import { CommunityCard } from "@/components/community-card";
import {
  Layout,
  DashboardItem,
  DashboardItemHeading,
} from "@/components/layout";
import { Search } from "@/components/search";
import Button from "@/components/ui/button";
import { CommunitySearchResult } from "@/lib/api/validators";
import { useExploreResultsQuery } from "@/lib/queries/search-queries";
import {
  useCommunitiesSearchResult,
  usePopularCommunities,
} from "@/lib/queries/useCommunities";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import communities from "@/pages/api/communities";
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
  const { data: communities } = useExploreResultsQuery(query);
  const { data: tags } = usePopularTags();

  const path = usePathname();
  const variantPath = React.useMemo(() => {
    const split = path.split("/");
    return decodeURI(split[split.length - 1]);
  }, [path]);

  return (
    <Layout heading="Explore">
      <Search defaultValue={query} />
      <div className="flex items-center justify-center gap-2">
        {typeof tags !== "undefined"
          ? tags.map(({ id, name }) => (
              <Link href={`/explore/search/${name}`} key={id}>
                <Button
                  type="button"
                  variant={variantPath === name ? "primary" : "white"}
                  size="sm"
                >
                  {name}
                </Button>
              </Link>
            ))
          : null}
      </div>
      {typeof communities !== "undefined" ? (
        <DashboardItem>
          {communities.pages.length > 0 ? (
            <React.Fragment>
              <DashboardItemHeading heading="Popular Communities" />
              {communities.pages.map(({ response }) =>
                response.map(({ community, isOwn, isSubscriber }) => (
                  <CommunityCard
                    community={community}
                    isOwn={isOwn}
                    isSubscriber={isSubscriber}
                    key={community.id}
                  />
                ))
              )}
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
