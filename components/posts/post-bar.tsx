import { MdThumbUp } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import React from "react";
import { Like } from "@/pages/api/like";
import { useSession } from "next-auth/react";
import { useLikeMutation } from "@/lib/mutations/useLikeMutation";

interface PostBarProps {
  views: number;
  postId: string;
  likes: Like[];
}

interface IconButtonProps {
  onClick(): void;
  children: React.ReactNode;
}
export function IconButton({ onClick, children }: IconButtonProps) {
  return (
    <div
      className="flex gap-1 items-center transition-all hover:text-rose-500 hover:underline cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function PostBar({ views, postId, likes }: PostBarProps) {
  const { data } = useSession();

  const likeIndex = React.useMemo(
    () => likes.findIndex((like) => like.userId === data?.user.id),
    [likes]
  );
  const { mutateAsync } = useLikeMutation(postId);

  async function onLikeClick() {
    await mutateAsync({
      isDeletion: likeIndex !== -1,
      likeId: likeIndex !== -1 ? likes[likeIndex].id : undefined,
    });
  }

  return (
    <div className="w-full flex gap-4 pt-2 px-8 text-sm">
      {data !== null ? (
        <div className={likeIndex !== -1 ? "!text-rose-500" : ""}>
          <IconButton onClick={onLikeClick}>
            <MdThumbUp />
            <p>{likeIndex !== -1 ? `${likes.length} Likes` : "Like"}</p>
          </IconButton>
        </div>
      ) : (
        <div className="flex gap-1 items-center">
          <MdThumbUp />
          <p>{likes.length} Likes</p>
        </div>
      )}
      <div className="flex gap-1 items-center">
        <BsEyeFill />
        <p>{views} Views</p>
      </div>
    </div>
  );
}
