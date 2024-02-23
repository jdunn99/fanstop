import { DashboardItem } from "@/components/layout";
import { PostComment } from "./post-comment";
import { CommentInput } from "./comment-input";
import { useCommentForPostQuery } from "@/lib/queries/useCommentQuery";
import { PostBar } from "../post-bar";
import React from "react";
import Button from "@/components/ui/button";

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
  const [cursor, setCursor] = React.useState<number>();
  const { data: comments, fetchNextPage } = useCommentForPostQuery(
    postId,
    cursor
  );

  // React.useEffect(() => {
  //   if (isSuccess && comments.hasMore) {
  //     setCursor(comments.cursor);
  //   }
  // }, [comments, isSuccess]);

  return (
    <DashboardItem>
      <PostBar postId={postId} views={views} likes={likes} isLiked={isLiked} />
      <div className="w-full px-8">
        <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
        <CommentInput postId={postId} />
      </div>
      <div className="pb-4">
        {typeof comments !== "undefined"
          ? comments.pages.map(({ response }) =>
              response.map((comment) => (
                <PostComment {...comment} key={comment.id} />
              ))
            )
          : null}
      </div>
      <Button onClick={() => fetchNextPage()}>Refetch</Button>
    </DashboardItem>
  );
}
