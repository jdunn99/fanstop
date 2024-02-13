import { useCreateCommunityMutation } from "@/lib/mutations/useCreateCommunityMutation";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { z } from "zod";
import { useRouter } from "next/router";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import {
  DashboardItem,
  DashboardItemHeading,
  Layout,
} from "@/components/layout";
import {
  useCommunitiesByIDQuery,
  useCommunitiesQuery,
} from "@/lib/queries/useCommunities";
import { useSession } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useUpdateCommunityMutation } from "@/lib/mutations/useUpdateCommunityMutation";
import { useCreateCommunityForm } from "@/lib/useCreateCommunityForm";
import { CreateCommunityForm, Form } from "@/components/create-community-form";

export default function Settings({
  slug,
  defaultImage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByIDQuery(slug);

  const { mutateAsync } = useUpdateCommunityMutation();
  const router = useRouter();

  const { selected, setSelected, profileImage, setProfileImage } =
    useCreateCommunityForm({
      defaultProfileImage: {
        src: defaultImage,
      },
      defaultSelected: {},
    });

  async function onSubmit({ name, slug, description }: Form) {
    await mutateAsync({
      id: data!.community.id,
      name,
      slug,
      description,
    });
    router.reload();
    router.push("/");
  }

  if (!data) {
    return null;
  }

  return (
    <Layout heading="Settings">
      <DashboardItem>
        <DashboardItemHeading heading="Your Community" />
        <p className="font-medium text-sm opacity-60">
          This is how others will see you on the site
        </p>
        <div className="lg:max-w-2xl">
          <CreateCommunityForm
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            onSubmit={onSubmit}
            selected={selected}
            setSelected={setSelected}
            defaultValues={{
              description: data.community.description,
              name: data.community.name,
              slug: data.community.slug,
            }}
          >
            <Button type="submit">Update</Button>
          </CreateCommunityForm>
        </div>
      </DashboardItem>
    </Layout>
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
    props: {
      slug: session.user.slug,
      defaultImage: session.user.image || "",
    },
  };
}
