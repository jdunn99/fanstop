import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { Avatar, AvatarImage } from "./ui/avatar";
import Button from "./ui/button";
import Textarea from "./ui/textarea";
import { Conversation, Message } from "@/lib/api/validators";
import { useSession } from "next-auth/react";
import { useMessagesForConversation } from "@/lib/queries/useMessagesForConversation";
import React from "react";
import { useCreateMessageMutation } from "@/lib/mutations/useCreateMessageMutation";

interface MessagesInputProps {
  conversationId: string;
}
function MessagesInput({ conversationId }: MessagesInputProps) {
  const [content, setContent] = React.useState<string>("");
  const { mutate } = useCreateMessageMutation(conversationId);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(content);
  }

  return (
    <form className="flex gap-2 items-start px-4" onSubmit={onSubmit}>
      <Textarea
        className="flex-1 bg-white resize-none"
        placeholder="Type a message..."
        onChange={(e: any) => setContent(e.target.value)}
      />
      <Button type="submit">Send</Button>
    </form>
  );
}

function MessageItem({ content, user, isOwn }: Message & { isOwn: boolean }) {
  return (
    <div
      className={`flex ${isOwn ? "flex-row-reverse " : ""} items-center gap-2`}
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
          <p className="text-xs text-slate-600">5:14 pm</p>
        </div>
        <p
          className={`text-sm p-2 rounded text-right ${
            isOwn ? "text-white bg-rose-500" : "text-slate-500 bg-white"
          }`}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

export function MessagesContainer({ id, name }: { id: string; name: string }) {
  const { data: session } = useSession();
  const { data: messages } = useMessagesForConversation(id);

  if (session === null) {
    return null;
  }

  return (
    <div className=" w-full h-[calc(100vh-73px)] bg-slate-50">
      <div className="fixed w-full lg:w-[calc(100vw-40rem)] px-6 py-[1.62rem]  bg-white border-b z-50 right-0">
        <div className="flex items-center p-0 gap-4">
          <Link href="/messages" shallow>
            <BsArrowLeft />
          </Link>
          <p className="text-sm font-semibold text-slate-800">{name}</p>
        </div>
      </div>
      <div className="h-full w-full flex flex-col-reverse justify-end p-8 mx-auto max-w-screen-lg ">
        <MessagesInput conversationId={id} />

        <div className="flex-1 flex flex-col justify-end py-2 gap-8 w-full mb-8 overflow-auto mt-24 px-4">
          {typeof messages !== "undefined"
            ? messages.map((message) => (
                <MessageItem
                  isOwn={message.userId === session.user.id}
                  {...message}
                  key={message.id}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
