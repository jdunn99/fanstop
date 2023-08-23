import { useCreateCommunityMutation } from "@/lib/mutations/useCreateCommunityMutation";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { z } from "zod";
import Button from "./ui/button";

const schema = z.object({
    name: z.string(),
    slug: z.string(),
});
type FormData = z.infer<typeof schema>;
export function CreateCommunity() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });
    const { mutate } = useCreateCommunityMutation();

    function onSubmit({ name, slug }: FormData) {
        mutate({ name, slug, tags: Object.values(selected) });
    }

    const { data: tags } = usePopularTags(10);
    const [selected, setSelected] = React.useState<Record<string, string>>({});

    return (
        <div className="px-8 flex h-screen w-screen flex-col items-center justify-center mx-auto">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[385px]">
                <div className="flex flex-col space-y-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create Your Community
                    </h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid gap-4"
                    >
                        <div className="grid gap-1 text-left">
                            <label className="text-left text-sm font-bold">
                                Community Name
                            </label>
                            <Input
                                {...register("name")}
                                placeholder="Community Name"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            <p className="text-sm text-red-500">
                                {errors.name?.message}
                            </p>
                        </div>
                        <div className="grid gap-1 text-left">
                            <label className="text-left text-sm font-bold">
                                Username
                            </label>
                            <Input
                                {...register("slug")}
                                placeholder="Username"
                                className={errors.slug ? "border-red-500" : ""}
                            />
                            <p className="text-sm text-red-500">
                                {errors.slug?.message}
                            </p>
                        </div>
                        <label className="text-left text-sm font-bold">
                            Tags
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                            {tags &&
                                tags.map(({ name, id }) => (
                                    <Button
                                        type="button"
                                        variant={
                                            selected[name]
                                                ? "primary"
                                                : "secondary"
                                        }
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
                                        {selected[name] ? (
                                            <MdClose className="mr-1" />
                                        ) : null}{" "}
                                        {name}
                                    </Button>
                                ))}
                        </div>

                        <Button type="submit">Create</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
