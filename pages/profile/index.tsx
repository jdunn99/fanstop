import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import {
  useCommunitiesByIDQuery,
  useCommunitiesByParamQuery,
} from "@/lib/queries/useCommunities";
import { ProfileComponent } from "@/components/profile";
import { useSession } from "next-auth/react";

export default function Profile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByParamQuery(user.id);
  return <ProfileComponent slug={user.id} data={data} />;
  // return <p>{JSON.stringify(data)}</p>;
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (session === null) {
    return {
      redirect: "/login",
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}
