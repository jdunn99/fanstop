import { DashboardItem } from "@/components/layout";
import { PostComment } from "./post-comment";
import { CommentInput } from "./comment-input";
import { PostBar } from "../post-bar";
import React from "react";
import Button from "@/components/ui/button";
import { useCommentsForPostQuery } from "@/lib/queries/comment-queries";
import { useIntersectionObserver } from "@/lib/useIntersection";

interface PostCommentSectionProps {
  postId: string;
  views: number;
  likes: number;
  isLiked: boolean;
}

export function PostCommentSection({
  postId,
  views,
  likes,
  isLiked,
}: // likes,
PostCommentSectionProps) {
  const { data: comments, fetchNextPage } = useCommentsForPostQuery(postId);

  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 1.0 });
  React.useEffect(() => {
    if (isIntersecting) {
      fetchNextPage();
    }
  }, [isIntersecting]);

  console.log(isIntersecting);

  return (
    <DashboardItem>
      <PostBar postId={postId} views={views} likes={likes} isLiked={isLiked} />
      <div className="w-full px-8">
        <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
        <CommentInput postId={postId} />
      </div>
      <div className="pb-4">
        {typeof comments !== "undefined"
          ? comments.pages.map(({ response }, pageIndex) =>
              response.map((comment, index) => (
                <div
                  key={comment.id}
                  ref={
                    pageIndex === comments.pages.length - 1 &&
                    index === response.length - 1
                      ? ref
                      : null
                  }
                >
                  <PostComment {...comment} />
                </div>
              ))
            )
          : null}
      </div>
    </DashboardItem>
  );
}
