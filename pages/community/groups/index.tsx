import React from "react";
import { PostTable } from "@/components/tables/post-table";
import { CommunityPageLayout } from "..";
import { GroupsTable } from "@/components/tables/groups-table";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

interface PostCommunityPageProps {
  children?: React.ReactNode;
}
export default function CommunityGroupsPage({
  children,
}: PostCommunityPageProps) {
  return (
    <CommunityPageLayout
      paths={[
        { href: "/community", disabled: true, value: "Community" },
        {
          href: "/community/groups",
          value: "Groups",
        },
      ]}
    >
      <GroupsTable />
      {children}
    </CommunityPageLayout>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (session === null) {
    return {
      redirect: "/",
    };
  }

  return {
    props: {},
  };
}
