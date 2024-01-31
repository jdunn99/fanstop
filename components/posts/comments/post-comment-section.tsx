import { DashboardItem } from "@/components/layout";
import { PostComment } from "./post-comment";
import { CommentInput } from "./comment-input";
import { useCommentForPostQuery } from "@/lib/queries/useCommentQuery";
import { Session } from "next-auth";
import { PostBar } from "../post-bar";

interface PostCommentSectionProps {
  postId: string;
  views: number;
}

export function PostCommentSection({
  postId,
  views,
}: // likes,
PostCommentSectionProps) {
  const { data: comments } = useCommentForPostQuery(postId);

  return (
    <DashboardItem>
      {/* <PostBar postId={postId} views={views} likes={likes} /> */}
      <div className="w-full px-8">
        <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
        <CommentInput postId={postId} />
      </div>
      <div className="pb-4">
        {typeof comments !== "undefined"
          ? comments.map((comment) => (
              <PostComment {...comment} key={comment.id} />
            ))
          : null}
      </div>
    </DashboardItem>
  );
}
