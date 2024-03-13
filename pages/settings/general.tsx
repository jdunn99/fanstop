import React from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/button";
import {
  DashboardItem,
  DashboardItemHeading,
  Layout,
} from "@/components/layout";
import { useCommunitiesByIDQuery } from "@/lib/queries/useCommunities";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useUpdateCommunityMutation } from "@/lib/mutations/useUpdateCommunityMutation";
import { useCreateCommunityForm } from "@/lib/useCreateCommunityForm";
import { CreateCommunityForm } from "@/components/forms/create-community-form";
import { TagsService } from "@/lib/services/tags-service";
import { Container } from "@/components/layout/container";
import { Sidebar } from "@/components/sidebar/sidebar";
import { LayoutHeader } from "@/components/layout/header";
import { LayoutPane } from "@/components/layout/content";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";

export default function Settings({
  slug,
  tags,
  defaultImage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByIDQuery(slug);
  const { data: socials } = useCommunitySocialsQuery(slug);

  const defaultSelected = React.useMemo(() => {
    const selected: Record<string, string> = {};

    for (const tag of tags) {
      selected[tag.name] = tag.id;
    }

    return selected;
  }, [tags]);

  if (!data || !socials) {
    return null;
  }

  return (
    <Container>
      <Sidebar />
      <LayoutPane>
        <div className="mx-auto lg:max-w-2xl">
          <div className="px-4 space-y-2 my-8">
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          <CreateCommunityForm
            isUpdate
            {...data.community}
            {...socials}
            defaultTags={defaultSelected}
          />
        </div>
      </LayoutPane>
    </Container>
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

  const tags = await TagsService.getTags({
    communities: {
      some: {
        slug: session.user.slug,
      },
    },
  });

  if (tags === null) {
    return {
      redirect: "/",
    };
  }

  return {
    props: {
      slug: session.user.slug,
      tags,
      defaultImage: session.user.image || "",
    },
  };
}
