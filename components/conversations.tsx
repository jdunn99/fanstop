import { BsPlus } from "react-icons/bs";
import Button from "./ui/button";
import Input from "./ui/input";
import { truncateString } from "@/lib/truncate";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useConversationQuery } from "@/lib/queries/useConversationQuery";
import { Conversation } from "@/lib/api/validators";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { CreateConversationButton } from "./create-conversation";
import {
  CreateConversationDrawer,
  CreateConversationDrawerButton,
} from "./conversations/create-conversation-drawer";

export function ConversationItem({ id, users, messages }: Conversation) {
  const [user] = users;
  const message = messages[0];

  const path = usePathname();
  const endPath = React.useMemo(() => {
    const split = path.split("/");
    return split[split.length - 1];
  }, [path]);

  return (
    <Link
      href={`/messages/${id}`}
      className={`flex items-center gap-2 border-y px-4 py-4 cursor-pointer hover:bg-slate-50 ${
        endPath === id ? "bg-rose-50" : ""
      }`}
    >
      <AvatarImage src={user.image} />
      <div className="">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-slate-800">{user.name}</h1>
          <p className="text-rose-500 text-sm font-bold">
            @{user.community.slug}
          </p>
        </div>

        {messages.length > 0 ? (
          <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap overflow-hidden w-full">
            <p className="text-slate-500 text-sm">
              {truncateString(message?.content, 40)}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(message?.createdAt).toDateString()}
            </p>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No messages yet...</p>
        )}
      </div>
    </Link>
  );
}

export function ConversationContainer() {
  const { data } = useConversationQuery();
  const path = usePathname();

  const isConversationPage = path === "/messages";

  return (
    <aside
      className={`inset-y-0 z-10 flex-shrink-0 w-full lg:w-96 bg-white border-r lg:flex  ${
        isConversationPage ? "flex" : "hidden"
      }`}
    >
      <div className="max-sm:flex-1 relative pt-4 w-full">
        <div className="px-2 pb-4 flex items-center gap-2">
          <Input
            type="search"
            className="w-full px-4"
            placeholder="Search messages"
          />
          <CreateConversationDrawerButton />
        </div>
        {typeof data !== "undefined"
          ? data.map((conversation) => (
              <ConversationItem key={conversation.id} {...conversation} />
            ))
          : null}
      </div>
    </aside>
  );
}
