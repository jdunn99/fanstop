import { useCreateCommunityMutation } from "@/lib/mutations/useCreateCommunityMutation";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { z } from "zod";
import Button from "./ui/button";
import Textarea from "./ui/textarea";
import { useRouter } from "next/router";
import { getFileData } from "@/lib/file";
import { image } from "@cloudinary/url-gen/qualifiers/source";
import { ProfileNav } from "./nav";

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
type Form = z.infer<typeof schema>;

export function CreateCommunity() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });
  const { mutateAsync } = useCreateCommunityMutation();
  const router = useRouter();
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = React.useState<{
    src: string;
    formData?: FormData;
  }>();

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

  async function onSubmit({ ...rest }: Form) {
    await mutateAsync({
      img: profileImage,
      tags: Object.values(selected),
      ...rest,
    });
    router.push("/");
  }

  const { data: tags } = usePopularTags(10);
  const [selected, setSelected] = React.useState<Record<string, string>>({});

  return (
    <div className="flex min-h-screen  flex-col items-center py-16 bg-slate-50 justify-center mx-auto">
      {/* <ProfileNav /> */}
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[385px]">
        <div className="flex flex-col space-y-8 ">
          <h1 className="text-2xl font-semibold text-center">
            Create Your Community
          </h1>

          <div className="lg:max-w-2xl">
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div
                className="flex items-center gap-4"
                onClick={() => imageInputRef.current?.click()}
              >
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
                />
                {errors.slug ? (
                  <p className="text-xs text-red-500">{errors.slug.message}</p>
                ) : null}
                <p className="text-xs opacity-60">
                  This is your public username that users can use to find your
                  content.{" "}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-left text-sm font-bold">
                  Community Name
                </label>
                <Input
                  {...register("name")}
                  className="bg-white w-full"
                  placeholder="Community Name"
                />
                <p className="text-xs opacity-60">
                  This is your public community name.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-left text-sm font-bold">
                  Description
                </label>
                <Textarea
                  {...register("description")}
                  className="bg-white w-full min-h-[60px]"
                  placeholder="Community Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-left text-sm font-bold">
                  Socials (Optional)
                </label>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Facebook</label>
                  <Input
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
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Instagram</label>
                  <Input
                    {...register("instagram")}
                    className="bg-white w-full"
                    placeholder="Instagram"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Facebook</label>
                  <Input
                    {...register("tiktok")}
                    className="bg-white w-full"
                    placeholder="Tiktok"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Website</label>
                  <Input
                    {...register("website")}
                    className="bg-white w-full"
                    placeholder="Website"
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
                        {selected[name] ? <MdClose className="mr-1" /> : null}{" "}
                        {name}
                      </Button>
                    ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button size="sm" type="submit" className="text-center">
                  Create Community
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
