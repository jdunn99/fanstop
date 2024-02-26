import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { ProfileComponent } from "@/components/profile";
import { useCommunityBySlug } from "@/lib/queries/community-queries";

export default function ProfilePage({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunityBySlug(slug);

  return <ProfileComponent slug={slug} data={data} />;
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      slug: z.string().parse(query.slug),
    },
  };
}
