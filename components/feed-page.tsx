import Link from "next/link";
import {
  Layout,
  DashboardItem,
  DashboardItemHeading,
  EmptyCard,
} from "./layout";
import { PostComponent } from "./posts/post-item";
import { useFeedQuery } from "@/lib/queries/useFeedQuery";
import React from "react";
import { isSameDate } from "@/lib/dates";

export function FeedPage() {
  const { data, isLoading } = useFeedQuery();

  const keys = React.useMemo(() => {
    if (data) {
      return Object.keys(data);
    } else {
      return [];
    }
  }, [data]);

  if (isLoading) {
    return null;
  }

  if (typeof data === "undefined") {
    return null;
  }

  return (
    <Layout heading="Your Feed">
      {keys.length > 0 ? (
        keys.map((group) => (
          <DashboardItem key={group}>
            <DashboardItemHeading
              heading={
                isSameDate(new Date(), new Date(group)) ? "Today" : group
              }
            />
            {data[group].map(({ post }) => (
              <PostComponent key={post.id} {...post} includeAuthor />
            ))}
          </DashboardItem>
        ))
      ) : (
        <EmptyCard heading="Feed">
          <h3 className="text-sm font-semibold text-slate-800">
            Your Feed is empty.
          </h3>
          <p className="text-xs mt-2 text-slate-600">
            To add items to your feed, you can subscribe to creators{" "}
            <Link href="/explore" className="text-rose-500">
              here.
            </Link>
          </p>
        </EmptyCard>
      )}
    </Layout>
  );
}
