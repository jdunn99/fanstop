import { CommunityCard } from "@/components/community-card";
import { DashboardItem, DashboardItemHeading } from "@/components/layout";
import { Container } from "@/components/layout/container";
import { Content, LayoutPane } from "@/components/layout/content";
import { LayoutHeader } from "@/components/layout/header";
import { Search } from "@/components/search";
import { Sidebar } from "@/components/sidebar/sidebar";
import Button from "@/components/ui/button";
import { useExploreResultsQuery } from "@/lib/queries/search-queries";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
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
    <Container>
      <Sidebar />
      <LayoutPane>
        <LayoutHeader paths={[{ href: "/explore", value: "Explore" }]} />
        <Content>
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
                  <DashboardItemHeading heading={`Searching for ${query}`} />
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
        </Content>
      </LayoutPane>
    </Container>
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
