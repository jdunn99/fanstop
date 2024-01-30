import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useCommunitiesByIDQuery } from "@/lib/queries/useCommunities";
import { ProfileComponent } from "@/components/profile";

export default function Profile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByIDQuery(user.id);
  return <ProfileComponent slug={user.id} data={data} />;
}

// export async function getServersideProps({
//   req,
//   res,
//   query,
// }: GetServerSidePropsContext) {
//   const session = await getServerSession(req, res, authOptions);

//   if (session === null) {
//     return {
//       redirect: {
//         destination: "/login",
//       },
//     };
//   }

//   return {
//     props: {
//       user: session.user,
//     },
//   };
// }
export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  console.log("SERVER SESSION: ", session);

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
