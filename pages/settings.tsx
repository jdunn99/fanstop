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
    router.push("/");
  }

  if (!data) {
    return null;
  }

  return (
    <Layout heading="Settings">
      <DashboardItem>
        <DashboardItemHeading heading="Your Community" />
        <div className="mx-auto h-[calc(100vh-350px)] flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-8 text-center">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">
                  Community Name
                </label>
                <Input
                  {...register("name")}
                  placeholder="Community Name"
                  defaultValue={data.community.name}
                  className="bg-white"
                />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
              </div>
              <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">Username</label>
                <Input
                  {...register("slug")}
                  placeholder="Username"
                  defaultValue={data.community.slug}
                  className="bg-white"
                />
                <p className="text-sm text-red-500">{errors.slug?.message}</p>
              </div>
              <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">
                  Descripton
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Description"
                  defaultValue={data.community.description}
                  className="bg-white"
                  //   className={errors.description ? "border-red-500" : "h-18"}
                />
                <p className="text-sm text-red-500">
                  {errors.description?.message}
                </p>
              </div>
              <Button type="submit">Update</Button>
            </form>
          </div>
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
