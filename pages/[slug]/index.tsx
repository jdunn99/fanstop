import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { useCommunitiesByIDQuery } from "@/lib/queries/useCommunities";
import { ProfileComponent } from "@/components/profile";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function ProfilePage({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByIDQuery(slug);

  return <ProfileComponent slug={slug} data={data} />;
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      slug: z.string().parse(query.slug),
    },
  };
}
