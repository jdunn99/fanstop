import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { useDeleteCommentMutation } from "@/lib/mutations/useDeleteCommentMutation";
import { useUpdateCommentMutation } from "@/lib/mutations/useUpdateCommentMutation";
import { Comment } from "@/lib/api/validators";
import { useSession } from "next-auth/react";
import React from "react";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";

export function PostComment({
  content,
  updatedAt,
  createdAt,
  user,
  id,
  postId,
}: Comment) {
  const { data } = useSession();
  const { mutateAsync } = useUpdateCommentMutation(id);
  const { mutateAsync: deleteCommentAsync } = useDeleteCommentMutation(id);

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editedText, setEditedText] = React.useState<string>(content);

  async function onSubmit() {
    await mutateAsync({ content: editedText, postId });
    setIsEditing(false);
  }

  async function deleteComment() {
    await deleteCommentAsync({ postId });
  }

  return (
    <div className="w-full flex items-start py-4 px-8">
      <div className="space-y-2 flex-1">
        <div className="flex gap-4">
          <AvatarImage src={user.image!} />
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
                  className="bg-white"
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
              <p className="prose pt-1">{content}</p>
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

          <Button size="xs" variant="ghost" onClick={deleteComment}>
            <BsTrashFill />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
