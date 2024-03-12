import React from "react";
import { DashboardItem } from "../layout";
import { PostComponent } from "../posts/post-item";
import { usePostsForCommunity } from "@/lib/queries/post-queries";
import { PostItem } from "@/lib/api/validators";
import { PostBottom } from "../posts/post-bottom";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface ProfilePostsProps {
  post: PostItem;
  setGroup(group: string): void;
}
export function ProfilePosts({ post, setGroup }: ProfilePostsProps) {
  return (
    <div className="grid gap-4" key={post.id}>
      <img
        className="w-full bg-slate-50 max-h-48 object-contain rounded-lg flex-shrink-0"
        src={post.image!}
      />
      {!post.group ? null : (
        <div>
          <Badge
            className="cursor-pointer"
            onClick={() => setGroup(post.group!.name)}
          >
            {post.group.name}
          </Badge>
        </div>
      )}
      <div className="space-y-4">
        <Link
          href={`/${post.author.community.slug}/${post.id}`}
          className="space-y-2 mt-4"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">{post.title}</h1>

            {post.isPublished ? null : (
              <div>
                <Badge variant="secondary">Unpublished</Badge>
              </div>
            )}
          </div>
          <p className=" text-slate-500 break-words mb-2">{post.description}</p>
        </Link>

        <p className="text-xs font-medium text-slate-600  truncate mb-2">
          {new Date(post.createdAt).toDateString()}
        </p>
        <PostBottom {...post} />
      </div>
    </div>
  );
}
