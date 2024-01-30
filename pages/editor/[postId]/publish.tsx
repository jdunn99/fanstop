import { Editor } from "@/components/editor/editor";
import { Layout } from "@/components/layout";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { uploadImage } from "@/lib/mutations/usePublishPostMutation";
import { getPostFromCache, usePostQuery } from "@/lib/queries/usePostQuery";
import { truncateString } from "@/lib/truncate";
import { Block, EditorState } from "@/lib/useEditor";
import tags from "@/pages/api/tags";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useMutation } from "react-query";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
});

type FormD = z.infer<typeof schema>;

export default function PostPublishPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: post, isLoading } = usePostQuery(postId);
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

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("upload_preset", "fanstop");

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

  const { mutate } = useMutation(
    ["post", postId],
    async ({ title, description, img }: FormD & { img: typeof coverImage }) => {
      let image: string | undefined = undefined;

      if (img) {
        if (img.formData) {
          image = await uploadImage(img.formData);
        } else {
          image = img.src;
        }
      }

      // now set the cover image as the first element
      let content = post!.content as unknown as Block[];
      if (content[0] && content[0].tag === "img") {
        content[0] = {
          ...content[0],
          data: {
            src: image,
          },
        };
      } else {
        content = [
          {
            id: new Date().toString(),
            data: {
              src: image,
            },
            tag: "img",
          },
          ...content,
        ];
      }

      console.log({ content });

      return fetch(`/api/posts/${postId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image,
          content,
          isPublished: true,
        }),
        method: "PUT",
      }).then((res) => res.json());
    }
  );

  async function onSubmit({ title, description }: FormD) {
    console.log("SUBMITTING");
    console.log({ title, description });
    mutate({ title, description, img: coverImage });
    router.push(`/post/${postId}`);
  }

  React.useEffect(() => {
    if (!isLoading && !post) {
      router.back();
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (!isLoading) {
      if (typeof post?.image !== "undefined") {
        setCoverImage({ src: post.image! });
      }
    }
  }, [isLoading]);

  if (!post) return null;

  return (
    <Layout heading="Publish Post">
      <div className="flex flex-col mx-auto">
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
        <div className="mx-auto h-[calc(100vh-250px)] flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-8 text-center">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">
                  Post Title
                </label>
                <Input
                  {...register("title")}
                  defaultValue={post.title}
                  className={`${errors.title ? "border-red-500" : ""} bg-white`}
                />
                <p className="text-sm text-red-500">{errors.title?.message}</p>
              </div>
              <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">
                  Descripton
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Description"
                  defaultValue={post.description}
                  className={`${
                    errors.description ? "border-red-500" : ""
                  } bg-white min-h-[64px]`}
                />
                <p className="text-sm text-red-500">
                  {errors.description?.message}
                </p>
              </div>
              <div className="grid gap-1 text-left">
                <label className="text-left text-sm font-bold">
                  Cover Image
                </label>
                <div
                  className="w-full border"
                  onClick={() => {
                    imageInputRef.current?.click();
                  }}
                >
                  {coverImage ? <img src={coverImage.src} /> : null}
                </div>
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Link href={`/editor/${postId}`}>
                  <Button variant="secondary">Cancel</Button>
                </Link>
                <Button type="submit">Publish</Button>
              </div>
            </form>
          </div>
        </div>
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
