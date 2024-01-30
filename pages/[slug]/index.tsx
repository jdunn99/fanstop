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
  pasta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByIDQuery(slug);
  const router = useRouter();

  React.useEffect(() => {
    if (pasta && data) {
      if (pasta.user.id === data.creatorId) {
        router.push("/profile");
      }
    }
    console.log(pasta, data?.creatorId);
  }, [pasta, data?.creatorId]);

  // console.log(session);
  return <ProfileComponent slug={slug} data={data} />;
}

export async function getServerSideProps({
  req,
  res,
  query,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  console.log("SERVER SESSION: ", session);

  return {
    props: {
      slug: z.string().parse(query.slug),
      pasta: session,
    },
  };
}
