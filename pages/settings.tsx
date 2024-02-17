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
import { authOptions } from "./api/auth/[...nextauth]";
import { useUpdateCommunityMutation } from "@/lib/mutations/useUpdateCommunityMutation";
import { useCreateCommunityForm } from "@/lib/useCreateCommunityForm";
import { CreateCommunityForm, Form } from "@/components/create-community-form";
import { getTagsForCommunity } from "@/lib/api/tags";

export default function Settings({
  slug,
  tags,
  defaultImage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByIDQuery(slug);

  const { mutateAsync } = useUpdateCommunityMutation();
  const router = useRouter();

  const defaultSelected = React.useMemo(() => {
    const selected: Record<string, string> = {};

    for (const tag of tags) {
      selected[tag.name] = tag.id;
    }

    return selected;
  }, []);

  const { selected, setSelected, profileImage, setProfileImage } =
    useCreateCommunityForm({
      defaultProfileImage: {
        src: defaultImage,
      },
      defaultSelected,
    });

  console.log(selected);

  async function onSubmit(data: Form) {
    await mutateAsync({
      id: slug,
      img: profileImage,
      tags: Object.values(selected),
      ...data,
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

  const tags = await getTagsForCommunity(session.user.slug);

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
