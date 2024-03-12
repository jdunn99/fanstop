import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
import { ImageInput, ImageState } from "../image-input";
import Button from "../ui/button";
import { useCreateGroupMutation } from "@/lib/mutations/group-mutations";

const CreateGroupFormSchema = z.object({
  name: z.string(),
  description: z.string(),
});
export function CreateGroupForm({
  setOpen,
}: {
  setOpen(value: boolean): void;
}) {
  const [coverImage, setCoverImage] = React.useState<ImageState>({ src: null });
  const form = useForm<z.infer<typeof CreateGroupFormSchema>>({
    resolver: zodResolver(CreateGroupFormSchema),
  });

  const { mutateAsync } = useCreateGroupMutation();

  async function onSubmit(values: z.infer<typeof CreateGroupFormSchema>) {
    await mutateAsync({
      image: coverImage,
      ...values,
    });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="px-4">
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Group name" {...field} className="w-full" />
              </FormControl>
              <FormDescription>This is the name of the group.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="px-4">
              <FormLabel>Group Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Group description"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                This is a short summary of what the posts in this group should
                be about.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="px-4">
          <FormLabel>Group Image</FormLabel>
          <ImageInput coverImage={coverImage} setCoverImage={setCoverImage} />
        </FormItem>

        <div className="flex justify-end px-4">
          <Button type="submit">Create Group</Button>
        </div>
      </form>
    </Form>
  );
}
