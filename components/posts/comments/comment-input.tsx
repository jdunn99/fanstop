import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { CreateCommentArgs } from "@/lib/api/validators";
import { useCreateCommentMutation } from "@/lib/mutations/comment-mutations";
import { useSession } from "next-auth/react";
import React from "react";

interface CommentInputProps {
  postId: string;
}

export function CommentInput({ postId }: CommentInputProps) {
  const { data: session } = useSession();

  const [comment, setComment] = React.useState<string>("");
  const { mutateAsync: createComment } = useCreateCommentMutation();

  const { toast } = useToast();

  async function onClick({ content, postId }: Partial<CreateCommentArgs>) {
    if (session === null) {
      toast({
        title: "Not signed in.",
        description: "You must be signed in to perform this action",
        variant: "error",
        timeout: 1000,
      });
    } else {
      await createComment({
        userId: "",
        content: content || "",
        postId: postId || "",
      });
      setComment("");
    }
  }

  return (
    <div className="flex items-start gap-2 mt-4 w-full">
      <Textarea
        placeholder="Comment"
        value={comment}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setComment(e.target.value)
        }
        className="w-full min-h-[80px] bg-white"
      />
      <Button
        onClick={() => onClick({ postId, content: comment })}
        className="relative"
      >
        Post
      </Button>
    </div>
  );
}
