import { Layout } from "./layout";
import React from "react";
import ExplorePage from "@/pages/explore";
import { FeedContent, useFeed } from "./feed-content";

export function FeedPage() {
  const { keys, data } = useFeed();

  if (data === undefined) {
    return null;
  }

  return keys.length > 0 ? (
    <Layout heading="Your Feed">
      <FeedContent />
    </Layout>
  ) : (
    <ExplorePage />
  );
}
