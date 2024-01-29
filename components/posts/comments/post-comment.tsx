import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { Comment } from "@/pages/api/posts/[postId]/comment";
import { useSession } from "next-auth/react";
import React from "react";
import {
  BsPencil,
  BsPencilFill,
  BsTrash2Fill,
  BsTrashFill,
} from "react-icons/bs";
import { useMutation, useQueryClient } from "react-query";

export function PostComment({
  content,
  updatedAt,
  createdAt,
  user,
  id,
  postId,
}: Comment) {
  const { data } = useSession();

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ["comment", id],
    () =>
      fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedText,
        }),
      }).then((res) => res.json()),
    {
      onSuccess(data, variables, context) {
        console.log("SUCCESS");
        queryClient.setQueryData(["comments", postId], (oldData) => {
          const temp = oldData as unknown as Comment[];
          const index = temp.findIndex((item) => item.id === id);

          const { content, updatedAt } = data as unknown as Comment;

          if (index !== -1) {
            temp[index] = {
              ...temp[index],
              content,
              updatedAt,
            };
          }
          return temp;
        });
      },
    }
  );

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editedText, setEditedText] = React.useState<string>(content);

  function onSubmit() {
    mutate();
    setIsEditing(false);
  }

  return (
    <div className="w-full flex items-start py-4 px-8">
      <div className="space-y-2 flex-1">
        <div className="flex gap-4">
          <Avatar />
          <div className="w-full">
            <h4 className="text-lg font-bold text-slate-900">{user.name}</h4>
            <p className="text-xs text-slate-500">
              {new Date(createdAt).toLocaleDateString()}{" "}
              {new Date(createdAt).getTime() === new Date(updatedAt).getTime()
                ? ""
                : "(Edited)"}
            </p>
            {isEditing ? (
              <div className="w-full flex flex-col mt-2 gap-2">
                <Textarea
                  defaultValue={editedText}
                  onChange={(e: any) => setEditedText(e.target.value)}
                />
                <div className="flex items-center gap-2 self-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" onClick={onSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm pt-4 text-slate-800">{content}</p>
            )}
          </div>
        </div>
      </div>
      {data?.user.id === user.id ? (
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
          >
            <BsPencilFill />
          </Button>

          <Button size="xs" variant="ghost">
            <BsTrashFill />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
