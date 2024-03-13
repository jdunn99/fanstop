import { FileImage } from "@/lib/file";
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
import { ImageInput, ImageState } from "../image-input";
import React from "react";
import { ProfileImage } from "../ui/profile-image";
import { useUpdateCommunityMutation } from "@/lib/mutations/useUpdateCommunityMutation";
import { useCreateCommunityMutation } from "@/lib/mutations/useCreateCommunityMutation";
import { Community } from "@/lib/api/validators";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import { MdClose } from "react-icons/md";
import { parseImageState } from "@/lib/parseImageState";

const CreateCommunitySchema = z.object({
  name: z.string(),
  slug: z.string().refine((s) => {
    const l = s.toLowerCase();

    return (
      !s.includes(" ") &&
      l !== "settings" &&
      l !== "profile" &&
      l !== "explore" &&
      l !== "editor" &&
      l !== "community" &&
      l !== "messages" &&
      l !== "publish"
    );
  }, "Invalid username"),
  description: z.string(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
});
type CreateCommunityFormType = z.infer<typeof CreateCommunitySchema>;

interface CreateCommunityFormsProps extends Partial<Community> {
  defaultTags?: Record<string, string>;
  isUpdate?: boolean;
}
export function CreateCommunityForm({
  isUpdate,
  image,
  defaultTags = {},
  id,
  ...rest
}: CreateCommunityFormsProps) {
  const form = useForm<CreateCommunityFormType>({
    resolver: zodResolver(CreateCommunitySchema),
    defaultValues: rest,
  });

  const [profileImage, setProfileImage] = React.useState<ImageState>({
    src: image || null,
  });

  const { mutateAsync: updateAsync } = useUpdateCommunityMutation();
  const { mutateAsync: createAsync } = useCreateCommunityMutation();
  const { data: tags } = usePopularTags(10);
  const [selected, setSelected] =
    React.useState<Record<string, string>>(defaultTags);

  async function onSubmit(values: CreateCommunityFormType) {
    const tagIds = Object.values(selected);
    const image = await parseImageState(profileImage);

    if (isUpdate && id) {
      await updateAsync({
        id,
        image,
        tags: tagIds,
        ...values,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-16">
        <div className="px-4">
          <ImageInput coverImage={profileImage} setCoverImage={setProfileImage}>
            {typeof profileImage !== "undefined" &&
            profileImage.src !== null ? (
              <img
                className="h-16 w-16 rounded-lg object-cover"
                src={profileImage.src}
              />
            ) : (
              <div className="h-16 w-16 bg-slate-400 rounded-lg" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800">
                Profile image
              </p>
              <p className="text-xs font-semibold text-rose-500">
                Upload Image
              </p>
            </div>
          </ImageInput>
        </div>
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="px-4">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Group name" {...field} className="w-full" />
              </FormControl>
              <FormDescription>
                This is your public username that users can use to find your
                content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="px-4">
              <FormLabel>Community Name</FormLabel>
              <FormControl>
                <Input placeholder="Group name" {...field} className="w-full" />
              </FormControl>
              <FormDescription>
                This is your public community name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="px-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  className="w-full min-h-[64px]"
                  defaultValue={field.value}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is a short description to tell other users about your
                community.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <label className="text-left text-sm font-bold px-4">
            Socials (Optional)
          </label>
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Facebook"
                    {...field}
                    className="w-full "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="Twitter" {...field} className="w-full " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Instagram"
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
            name="tiktok"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>TikTok</FormLabel>
                <FormControl>
                  <Input placeholder="TikTok" {...field} className="w-full " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem className="px-4">
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Website" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2 px-4">
          <label className="text-left text-sm font-bold">Tags</label>
          <div className="flex flex-wrap items-center gap-2">
            {tags &&
              tags.map(({ name, id }) => (
                <Button
                  type="button"
                  variant={selected[name] ? "primary" : "outline"}
                  size="sm"
                  key={name}
                  onClick={() => {
                    setSelected((selected) => {
                      const temp = {
                        ...selected,
                      };

                      if (!temp[name]) {
                        temp[name] = id;
                      } else {
                        delete temp[name];
                      }

                      return temp;
                    });
                  }}
                >
                  {selected[name] ? <MdClose className="mr-1" /> : null} {name}
                </Button>
              ))}
          </div>
        </div>
        <div className="px-4 flex justify-end">
          <Button type="submit">
            {isUpdate ? "Update" : "Create your community"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
