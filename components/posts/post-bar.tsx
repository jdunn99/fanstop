import { MdComment, MdThumbUp } from "react-icons/md";
import { Avatar } from "../ui/avatar";
import Button from "../ui/button";
import Textarea from "../ui/textarea";
import { BsEye, BsEyeFill } from "react-icons/bs";

interface PostBarProps {
  views: number;
  postId: string;
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

export function PostBar({ views, postId }: PostBarProps) {
  return (
    <div className="w-full flex gap-4 pt-2 px-8 text-sm">
      <IconButton onClick={() => null}>
        <MdThumbUp />
        <p>Like</p>
      </IconButton>
      <div className="flex gap-1 items-center">
        <BsEyeFill />
        <p>{views} Views</p>
      </div>
    </div>
  );
}
