import { useCreateCommunityMutation } from "@/lib/mutations/useCreateCommunityMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { z } from "zod";
import Button from "./ui/button";
import Input from "./ui/input";
import Textarea from "./ui/textarea";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import { FileImage, getFileData } from "@/lib/file";

const schema = z.object({
  name: z.string(),
  slug: z.string().refine((s) => {
    const l = s.toLowerCase();

    return (
      !s.includes(" ") &&
      l !== "settings" &&
      l !== "profile" &&
      l !== "explore" &&
      l !== "editor" &&
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
export type Form = z.infer<typeof schema>;

interface CreateCommunityFormProps {
  onSubmit(args: Form): void;
  profileImage?: FileImage;
  setProfileImage(file: FileImage): void;
  selected: Record<string, string>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  children?: React.ReactNode;
  defaultValues?: {
    slug?: string;
    name?: string;
    description?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    website?: string;
  };
}

export function CreateCommunityForm({
  onSubmit,
  profileImage,
  setProfileImage,
  selected,
  setSelected,
  defaultValues,
  children,
}: CreateCommunityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const { data: tags } = usePopularTags(10);

  const imageInputRef = React.useRef<HTMLInputElement>(null);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const { reader, formData } = getFileData(event.target.files[0]);

      reader.onload = (event) => {
        const { target } = event;
        if (!target) {
          return;
        }

        setProfileImage({ src: target.result!.toString(), formData });
      };

      reader.readAsDataURL(selectedFile);
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div
        className="flex items-center gap-4"
        onClick={() => imageInputRef.current?.click()}
      >
        {typeof profileImage !== "undefined" && profileImage.src !== null ? (
          <img
            className="h-16 w-16 rounded-lg object-cover"
            src={profileImage.src}
          />
        ) : (
          <div className="h-16 w-16 bg-slate-400 rounded-lg" />
        )}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">Profile image</p>
          <p className="text-xs font-semibold text-rose-500">Upload Image</p>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        onChange={onFileChange}
      />
      <div className="space-y-2">
        <label className="text-left text-sm font-bold">Username</label>
        <Input
          {...register("slug")}
          className="bg-white w-full"
          required
          placeholder="Username"
          defaultValue={defaultValues?.slug}
        />
        {errors.slug ? (
          <p className="text-xs text-red-500">{errors.slug.message}</p>
        ) : null}
        <p className="text-xs opacity-60">
          This is your public username that users can use to find your content.{" "}
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-left text-sm font-bold">Community Name</label>
        <Input
          {...register("name")}
          className="bg-white w-full"
          placeholder="Community Name"
          defaultValue={defaultValues?.name}
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
          placeholder="Community Name"
          defaultValue={defaultValues?.description}
        />
      </div>
      <div className="space-y-2">
        <label className="text-left text-sm font-bold">
          Socials (Optional)
        </label>
        <div className="space-y-1">
          <label className="text-xs font-semibold">Facebook</label>
          <Input
            defaultValue={defaultValues?.facebook}
            {...register("facebook")}
            className="bg-white w-full"
            placeholder="Facebook"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold">Twitter</label>
          <Input
            {...register("twitter")}
            className="bg-white w-full"
            placeholder="Twitter"
            defaultValue={defaultValues?.twitter}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold">Instagram</label>
          <Input
            {...register("instagram")}
            className="bg-white w-full"
            placeholder="Instagram"
            defaultValue={defaultValues?.instagram}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold">Facebook</label>
          <Input
            {...register("tiktok")}
            className="bg-white w-full"
            placeholder="Tiktok"
            defaultValue={defaultValues?.tiktok}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold">Website</label>
          <Input
            {...register("website")}
            className="bg-white w-full"
            placeholder="Website"
            defaultValue={defaultValues?.website}
          />
        </div>
      </div>
      <div className="space-y-2">
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
      {children}
    </form>
  );
}
