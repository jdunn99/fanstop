import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "./ui/input";
import Button from "./ui/button";
import { useRouter } from "next/router";
import { usePopularTags } from "@/lib/queries/usePopularTags";
import React from "react";
import { MdRemove } from "react-icons/md";
import { useCreateCommunityMutation } from "@/lib/mutations/useCreateCommunityMutation";

const schema = z.object({
    name: z.string(),
});
type FormData = z.infer<typeof schema>;

export function CreateInput() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });
    const { data: tags } = usePopularTags(10);
    const { mutate } = useCreateCommunityMutation();
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

    const [test, setTest] = React.useState<Set<string>>(new Set());

    function onSubmit({ name }: FormData) {
        mutate({ name });
    }

    function onTagSelect(name: string) {}

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 w-full">
            <div className="grid gap-1 text-left pb-4">
                <label className="text-left text-sm font-bold">
                    Community Name
                </label>
                <Input
                    {...register("name")}
                    type="text"
                    placeholder="Community name"
                    className={errors.name ? "border-red-500" : ""}
                />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <label className="text-left text-sm font-bold">Tags</label>

            <div className="flex flex-wrap items-center gap-4">
                {tags &&
                    tags.map(({ name }) => (
                        <Button
                            type="button"
                            variant={test.has(name) ? "primary" : "secondary"}
                            size="sm"
                            key={name}
                            onClick={() => {
                                setTest((test) => {
                                    const temp = new Set(test);

                                    if (temp.has(name)) temp.delete(name);
                                    else temp.add(name);
                                    return temp;
                                });
                            }}
                        >
                            {name}
                        </Button>
                    ))}
            </div>
            <Button type="submit">Continue</Button>
            <p className="text-sm">{errors.name?.message}</p>
        </form>
    );
}
