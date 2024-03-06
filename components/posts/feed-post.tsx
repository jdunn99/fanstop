import { PostItem } from "@/lib/api/validators";
import { BsHeart } from "react-icons/bs";
import { FaRegCommentAlt } from "react-icons/fa";
import { AvatarImage } from "../ui/avatar";
import Link from "next/link";
import Image from "next/image";

interface FeedPostProps {
  includeAuthor?: boolean;
  post: PostItem;
}

function FeedPostHeading({ includeAuthor, post }: FeedPostProps) {
  return includeAuthor ? (
    <Link href={`/${post.author.community.slug}`} className="">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-slate-800">
          {post.author.name}
        </h1>
        <p className="text-xs font-medium text-slate-500">
          {new Date(post.createdAt).toDateString()}
        </p>
      </div>
      <p className="text-xs font-medium text-rose-500">
        @{post.author.community.slug}
      </p>
    </Link>
  ) : (
    <p className="text-xs font-medium text-slate-500">
      {new Date(post.createdAt).toDateString()}
    </p>
  );
}

export function FeedPost({ includeAuthor, post }: FeedPostProps) {
  return (
    <div>
      <div className="flex items-start gap-4 border-b py-4">
        {includeAuthor ? <AvatarImage src={post.author.image!} /> : null}
        <div className="flex items-start justify-between w-full flex-col md:flex-row">
          <div className="space-y-4 flex-1">
            <FeedPostHeading includeAuthor={includeAuthor} post={post} />
            <Link
              className="flex flex-col"
              href={`/${post.author.community.slug}/${post.id}`}
            >
              <h1 className="font-bold text-slate-800 text-xl">{post.title}</h1>
              <p className="text-slate-600 pr-4 leading-relaxed">
                {post.description}
              </p>
            </Link>
            <div className="flex items-center gap-8 text-sm text-slate-500 font-semibold">
              <button className="inline-flex gap-2 items-center">
                <BsHeart />
                {post._count.likes}
              </button>

              <Link href={`/${post.author.community.slug}/${post.id}#comments`}>
                <button className="inline-flex gap-2 items-center">
                  <FaRegCommentAlt />
                  {post._count.comments}
                </button>
              </Link>
            </div>
          </div>
          {post.image ? (
            <Image
              className="rounded-lg object-fill"
              alt="image"
              width={256}
              height={192}
              src={post.image!}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
