import { BsHeart, BsHeartFill } from "react-icons/bs";

interface LikePostButtonProps {
  id: string;
  likes: number;
  isLiked?: boolean;
}
export function LikePostButton({ id, likes, isLiked }: LikePostButtonProps) {
  return (
    <button className="inline-flex gap-1 items-center hover:text-rose-500">
      {isLiked ? <BsHeartFill className="text-rose-500" /> : <BsHeart />}
      <span className="text-slate-500">{likes}</span>
    </button>
  );
}
