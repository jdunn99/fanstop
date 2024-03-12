import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Input from "../ui/input";
import Textarea from "../ui/textarea";
import Button from "../ui/button";
import { BsPlusCircleFill } from "react-icons/bs";
import { getFileData } from "@/lib/file";
import React from "react";
import { FormContainer } from "../form-container";
import { useRouter } from "next/router";
import { PostItem } from "@/lib/api/validators";
import { useToast } from "../ui/toast";
import { usePublishPostMutation } from "@/lib/mutations/usePublishPostMutation";
import { usePostContentQuery } from "@/lib/queries/usePostQuery";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { useGroupsForAuthedUser } from "@/lib/queries/group-queries";

const PostUpdateFormSchema = z.object({
  title: z.string(),
  description: z.string().default(""),
  visibility: z.union([z.literal("Subscribers only"), z.literal("Anyone")]),
  comments: z.union([z.literal("Enable"), z.literal("Disable")]),
  isPublished: z.boolean(),
  group: z.string(),
});
export type PostUpdateFormProps = z.infer<typeof PostUpdateFormSchema>;

export function PostUpdateForm({
  id,
  title,
  description,
  subscribersOnly,
  commentsVisible,
  isPublished,
  image,
  group,
}: PostItem) {
  const form = useForm<PostUpdateFormProps>({
    resolver: zodResolver(PostUpdateFormSchema),
    defaultValues: {
      title,
      description: description?.toString(),
      comments: commentsVisible ? "Enable" : "Disable",
      visibility: subscribersOnly ? "Subscribers only" : "Anyone",
      group: !!group ? group.name : "None",
      isPublished,
    },
  });

  const { mutateAsync } = usePublishPostMutation(id);
  const { data: content } = usePostContentQuery(id);
  const { data: groups } = useGroupsForAuthedUser();

  const [coverImage, setCoverImage] = React.useState<{
    src: string | null;
    formData?: FormData;
  }>(() => (image !== null ? { src: image } : { src: null }));

  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(values: PostUpdateFormProps) {
    if (typeof content !== "undefined") {
      if (content === null) {
        toast({
          title: "Error",
          description:
            "The content of the post is empty. You must add content before you can publish it.",
          variant: "error",
          timeout: 2000,
        });
        router.back();
        return;
      }

      const { comments, group, visibility, ...rest } = values;

      await mutateAsync({
        img: coverImage,
        commentsVisible: comments === "Enable",
        subscribersOnly: visibility === "Subscribers only",
        postContent: content!,
        group: group !== "None" ? group : undefined,
        ...rest,
      });
      toast({
        title: "Success",
        description: "Post updated successfully",
        variant: "success",
      });

      setTimeout(() => router.back(), 1000);
    }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="h-[calc(100vh-200px)] overflow-auto  space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>Post Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Post title"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>Post Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Post description"
                    className="w-full min-h-[96px]"
                    defaultValue={field.value}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is a short summary about your post
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="px-4 flex flex-row items-center justify-between">
                <div className="space-y-2">
                  <FormLabel>Published</FormLabel>
                  <FormDescription>
                    Publish this post to your intended audience.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    placeholder="Post description"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem className="px-4 flex flex-row items-center justify-between">
                <div className="space-y-2">
                  <FormLabel>Post Group</FormLabel>
                  <FormDescription>
                    Choose the group (if any) that you would like to add this
                    post to.
                  </FormDescription>
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    {typeof groups !== "undefined"
                      ? groups.pages.map((page) =>
                          page.response.map(({ name }) => (
                            <SelectItem value={name}>{name}</SelectItem>
                          ))
                        )
                      : null}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>Visibility</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1">
                    <input
                      {...field}
                      checked={field.value === "Anyone"}
                      value="Anyone"
                      className="accent-rose-500"
                      type="radio"
                    />
                    <label className="text-sm font-semibold opacity-80">
                      Anyone
                    </label>
                  </div>
                </FormControl>

                <FormControl>
                  <div className="flex items-center gap-1">
                    <input
                      {...field}
                      checked={field.value === "Subscribers only"}
                      value="Subscribers only"
                      className="accent-rose-500"
                      type="radio"
                    />
                    <label className="text-sm font-semibold opacity-80">
                      Subscribers only
                    </label>
                  </div>
                </FormControl>
                <FormDescription>
                  This determines who can see your post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>Enable Comments</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1">
                    <input
                      {...field}
                      value="Enable"
                      checked={field.value === "Enable"}
                      className="accent-rose-500"
                      type="radio"
                    />
                    <label className="text-sm font-semibold opacity-80">
                      Enable
                    </label>
                  </div>
                </FormControl>

                <FormControl>
                  <div className="flex items-center gap-1">
                    <input
                      {...field}
                      value="Disable"
                      checked={field.value === "Disable"}
                      className="accent-rose-500"
                      type="radio"
                    />
                    <label className="text-sm font-semibold opacity-80">
                      Disable
                    </label>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="px-4">
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
                ref={imageInputRef}
                className="hidden"
                type="file"
                onChange={onFileChange}
              />
            </FormContainer>
          </div>
        </div>
        <div className="fixed  bottom-0 w-full bg-white z-50 px-4 pr-12 py-6">
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              type="reset"
            >
              Cancel
            </Button>
            <Button className="" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
