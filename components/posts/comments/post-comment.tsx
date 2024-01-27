import { Avatar } from "@/components/ui/avatar";
import { Comment } from "@/pages/api/posts/[postId]/comment";

export function PostComment({ content, user }: Comment) {
  return (
    <div className="space-y-2 py-4 px-8">
      <div className="flex gap-4">
        <Avatar />
        <div className="">
          <h4 className="text-lg font-bold text-slate-900">{user.name}</h4>
          <p className="text-xs text-slate-500">01/27/2024 9:33AM</p>
          <p className="text-sm pt-4 text-slate-800">{content}</p>
        </div>
      </div>
    </div>
  );
}
