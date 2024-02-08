import { MdThumbUp } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import React from "react";
import { useSession } from "next-auth/react";
import { useLikeMutation } from "@/lib/mutations/useLikeMutation";

interface PostBarProps {
  views: number;
  postId: string;
  likes: number;
  isLiked: boolean;
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

export function PostBar({ views, postId, likes, isLiked }: PostBarProps) {
  const { data } = useSession();
  const { mutateAsync } = useLikeMutation(postId);

  async function onLikeClick() {
    await mutateAsync({
      isDeletion: isLiked,
    });
  }

  return (
    <div className="w-full flex gap-4 pt-2 px-8 text-sm">
      {data !== null ? (
        <div
          className={`${
            isLiked && "!text-rose-500"
          } font-semibold text-sm text-slate-600`}
        >
          <IconButton onClick={onLikeClick}>
            <MdThumbUp />
            <p>{isLiked ? `${likes} Likes` : "Like"}</p>
          </IconButton>
        </div>
      ) : (
        <div className="flex gap-1 items-center font-semibold text-sm text-slate-600">
          <MdThumbUp />
          <p>{likes} Likes</p>
        </div>
      )}
      <div className="flex gap-1 items-center font-semibold text-sm text-slate-600">
        <BsEyeFill />
        <p>{views} Views</p>
      </div>
    </div>
  );
}
