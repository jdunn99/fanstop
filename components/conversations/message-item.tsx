import { Message } from "@/lib/api/validators";
import { AvatarImage } from "../ui/avatar";

export function MessageItem({
  content,
  user,
  isOwn,
  createdAt,
  id,
}: Message & { isOwn: boolean }) {
  return (
    <div
      className={`flex ${isOwn ? "flex-row-reverse " : ""} items-center gap-2`}
      id={id}
    >
      <AvatarImage src={user.image} />
      <div
        className={`flex flex-col gap-2 ${isOwn ? "items-end" : "items-start"}`}
      >
        <div
          className={`${
            isOwn ? "flex-row-reverse " : ""
          } flex items-center gap-2`}
        >
          <p className="text-sm font-semibold text-slate-800">{user.name}</p>
          <p className="text-xs text-slate-600">
            {new Date(createdAt).toLocaleDateString([], {
              dateStyle: "short",
            })}{" "}
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <p
          className={`text-sm p-2 rounded text-right ${
            isOwn ? "text-white bg-rose-500" : "text-slate-500 bg-slate-50"
          }`}
        >
          {content}
        </p>
      </div>
    </div>
  );
}
