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

const schema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
});
type FormData = z.infer<typeof schema>;

export default function Settings({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCommunitiesByIDQuery(slug);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { mutateAsync } = useUpdateCommunityMutation();
  const router = useRouter();

  async function onSubmit({ name, slug, description }: FormData) {
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
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-left text-sm font-bold">Username</label>
              <Input
                {...register("slug")}
                className="bg-white w-full"
                defaultValue={data.community.slug}
                placeholder="Username"
              />
              <p className="text-xs opacity-60">
                This is your public username that users can use to find your
                content.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-left text-sm font-bold">
                Community Name
              </label>
              <Input
                {...register("name")}
                className="bg-white w-full"
                defaultValue={data.community.name}
                placeholder="Community Name"
              />
              <p className="text-xs opacity-60">
                This is your public community name.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-left text-sm font-bold">Description</label>
              <Textarea
                {...register("description")}
                className="bg-white w-full min-h-[60px]"
                defaultValue={data.community.description}
                placeholder="Community Name"
              />
            </div>
            <Button size="sm" type="submit">
              Update Community
            </Button>
          </form>
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
    },
  };
}
