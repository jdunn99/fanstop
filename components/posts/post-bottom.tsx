import { PostItem } from "@/lib/api/validators";
import Link from "next/link";
import { BsHeart } from "react-icons/bs";
import { FaRegCommentAlt } from "react-icons/fa";
import { LikePostButton } from "./like-post-button";

export function PostBottom(post: PostItem) {
  return (
    <div className="flex items-center gap-4 text-sm text-slate-500 font-semibold">
      <LikePostButton id={post.id} likes={post._count.likes} />

      <Link href={`/${post.author.community.slug}/${post.id}#comments`}>
        <button className="inline-flex gap-2 items-center">
          <FaRegCommentAlt />
          {post._count.comments}
        </button>
      </Link>
    </div>
  );
}
