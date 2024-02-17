import { isSameDate } from "@/lib/dates";
import { useFeedQuery } from "@/lib/queries/useFeedQuery";
import React from "react";
import { DashboardItem, DashboardItemHeading } from "./layout";
import { PostComponent } from "./posts/post-item";

export function useFeed() {
  const { data, isLoading } = useFeedQuery();
  const keys = React.useMemo(() => {
    if (data) {
      return Object.keys(data);
    } else {
      return [];
    }
  }, [data]);

  return { data, isLoading, keys };
}

export function FeedContent() {
  const { data, isLoading, keys } = useFeed();

  if (isLoading) {
    return null;
  }

  if (typeof data === "undefined") {
    return null;
  }

  return keys.map((group) => (
    <DashboardItem key={group}>
      <DashboardItemHeading
        heading={isSameDate(new Date(), new Date(group)) ? "Today" : group}
      />
      {data[group].map(({ post }) => (
        <PostComponent key={post.id} {...post} includeAuthor />
      ))}
    </DashboardItem>
  ));
}
