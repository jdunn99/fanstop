import { FormContainer } from "@/components/form-container";
import { DashboardItem, Layout } from "@/components/layout";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { getFileData } from "@/lib/file";
import { usePublishPostMutation } from "@/lib/mutations/usePublishPostMutation";
import { usePostContentQuery, usePostQuery } from "@/lib/queries/usePostQuery";
import { truncateString } from "@/lib/truncate";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { BsPlusCircleFill } from "react-icons/bs";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  visibility: z.union([z.literal("Subscribers only"), z.literal("Anyone")]),
  comments: z.union([z.literal("Enable"), z.literal("Disable")]),
});
type FormD = z.infer<typeof schema>;

export default function PostPublishPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading } = usePostQuery(postId);
  const { data: content } = usePostContentQuery(postId);
  const { data: session } = useSession();
  const { mutateAsync } = usePublishPostMutation(postId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormD>({ resolver: zodResolver(schema) });

  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = React.useState<{
    src: string;
    formData?: FormData;
  }>();

  const router = useRouter();

  async function onSubmit({ title, description, comments, visibility }: FormD) {
    mutateAsync({
      title,
      description,
      img: coverImage,
      postContent: content!,
      isPublished: true,
      commentsVisible: comments === "Enable",
      subscribersOnly: visibility === "Subscribers only",
    });
    router.push(`/${session!.user.slug}/${postId}`);
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const { reader, formData } = getFileData(event.target.files[0]);

      reader.onload = (event) => {
        const { target } = event;
        if (!target) {
          return;
        }

        setCoverImage({ src: target.result!.toString(), formData });
      };

      reader.readAsDataURL(selectedFile);
    }
  }

  // React.useEffect(() => {
  //   if (!isLoading && !post) {
  //     router.back();
  //   }
  // }, [isLoading]);

  React.useEffect(() => {
    if (!isLoading && typeof data !== "undefined") {
      if (typeof data.post.image !== "undefined") {
        setCoverImage({ src: data.post.image! });
      }
    }
  }, [data, isLoading]);

  if (!data) return null;
  if (!content) return null;

  const { post } = data;

  return (
    <Layout heading="Publish Post">
      <div className="lg:max-w-2xl space-y-8">
        <Breadcrumbs
          paths={[
            { href: "/", value: "Home" },
            {
              href: `/editor/${postId}`,
              value: truncateString(post.title, 20),
            },
            { href: `/editor/${postId}/publish`, value: "Publish" },
          ]}
        />
        <DashboardItem>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormContainer
              label="Post Title"
              errorMessage={errors.title?.message}
            >
              <Input
                {...register("title")}
                defaultValue={post.title}
                className={`${errors.title ? "border-red-500" : ""} bg-white`}
              />
            </FormContainer>
            <FormContainer
              label="Description"
              errorMessage={errors.description?.message}
            >
              <Textarea
                {...register("description")}
                placeholder="Description"
                defaultValue={post.description || ""}
                className={`${
                  errors.description ? "border-red-500" : ""
                } bg-white min-h-[64px]`}
              />
            </FormContainer>
            <FormContainer label="Visiblity">
              <div className="flex items-center gap-1">
                <input
                  {...register("visibility")}
                  type="radio"
                  value="Anyone"
                  className="accent-rose-500"
                  defaultChecked
                />
                <label>Anyone</label>
              </div>

              <div className="flex items-center gap-1">
                <input
                  {...register("visibility")}
                  type="radio"
                  value="Subscribers only"
                  className="accent-rose-500"
                />
                <label className="text-sm font-semibold opacity-80">
                  Subscribers only
                </label>
              </div>
            </FormContainer>
            <FormContainer label="Enable Comments">
              <div className="flex items-center gap-1">
                <input
                  {...register("comments")}
                  type="radio"
                  value="Enable"
                  className="accent-rose-500"
                  defaultChecked
                />
                <label className="text-sm font-semibold opacity-80">
                  Enable
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  {...register("comments")}
                  type="radio"
                  value="Disable"
                  className="accent-rose-500"
                />
                <label className="text-sm font-semibold opacity-80">
                  Disable
                </label>
              </div>
            </FormContainer>
            <FormContainer label="Cover Image">
              <div
                className="w-full border min-h-[64px] rounded-xl cursor-pointer bg-white hover:bg-rose-50"
                onClick={() => {
                  imageInputRef.current?.click();
                }}
              >
                {typeof coverImage !== "undefined" &&
                coverImage.src !== null ? (
                  <img
                    src={coverImage.src}
                    className="rounded-xl hover:opacity-50"
                  />
                ) : (
                  <p className="flex justify-center items-center h-full gap-2 text-slate-600 font-semibold">
                    <BsPlusCircleFill /> Add image
                  </p>
                )}
              </div>
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                onChange={onFileChange}
              />
            </FormContainer>
            <div className="flex items-center gap-2 ml-auto">
              <Link href={`/editor/${postId}`}>
                <Button variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit">Publish</Button>
            </div>
          </form>
        </DashboardItem>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      postId: z.string().parse(query.postId),
    },
  };
}
