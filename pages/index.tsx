import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { isAuthed } from "@/lib/authSSR";
import { CreateCommunity } from "@/components/create-community";
import { HomePage } from "@/components/home-page";
import { FeedPage } from "@/components/feed-page";

export default function Home({
  data,
  hasCommunity,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return data ? (
    hasCommunity ? (
      <FeedPage />
    ) : (
      <CreateCommunity />
    )
  ) : (
    <HomePage />
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const { data, hasCommunity } = await isAuthed({ req, res });

  return {
    props: {
      data,
      hasCommunity,
    },
  };
}
