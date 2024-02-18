import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { AvatarImage } from "./ui/avatar";
import Button from "./ui/button";
import Textarea from "./ui/textarea";
import { Message } from "@/lib/api/validators";
import { useSession } from "next-auth/react";
import { useMessagesForConversation } from "@/lib/queries/useMessagesForConversation";
import React from "react";
import { useCreateMessageMutation } from "@/lib/mutations/useCreateMessageMutation";
interface MessagesInputProps {
  conversationId: string;
}
function MessagesInput({ conversationId }: MessagesInputProps) {
  const [content, setContent] = React.useState<string>("");
  const { mutateAsync } = useCreateMessageMutation(conversationId);
  // For some reason TextAreaAutosize value isn't being set. So just going to clear thhe form for now
  const ref = React.useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (content === "") {
      return;
    }

    await mutateAsync(content);

    setContent("");
    if (ref.current) {
      ref.current.reset();
    }
  }

  return (
    <form className="flex gap-2 items-start px-4" onSubmit={onSubmit} ref={ref}>
      <Textarea
        className="flex-1 bg-white resize-none text-base"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button type="submit">Send</Button>
    </form>
  );
}

function MessageItem({
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
            isOwn ? "text-white bg-rose-500" : "text-slate-500 bg-white"
          }`}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

function MessageList({ id }: { id: string }) {
  const { data: session } = useSession();
  const { data: messages } = useMessagesForConversation(id);

  React.useEffect(() => {
    if (typeof messages !== "undefined") {
      const newMessage = messages[0];

      if (!newMessage) {
        return;
      }

      const element = document.getElementById(newMessage.id);

      if (!element) {
        return;
      }

      element.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages?.length]);

  if (session === null) {
    return null;
  }

  return (
    <div
      id="list"
      className="flex-1 h-full overflow-auto px-4 mt-12 py-2 gap-8 w-full flex flex-col-reverse mb-8"
    >
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
  );
}

export function MessagesContainer({ id, name }: { id: string; name: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleResize = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = `${window.innerHeight - 73}px`;
    }
  }, [ref]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize();
    }
  }, []);

  return (
    <div className=" w-full bg-slate-50" ref={ref}>
      <div className="fixed w-full lg:w-[calc(100vw-40rem)] px-6 py-[1.62rem]  bg-white border-b z-50 right-0">
        <div className="flex items-center p-0 gap-4">
          <Link href="/messages" shallow>
            <BsArrowLeft />
          </Link>
          <p className="text-sm font-semibold text-slate-800">{name}</p>
        </div>
      </div>
      <div className="h-full flex flex-col justify-start p-8 max-w-screen-lg mx-auto">
        <MessageList id={id} />
        <MessagesInput conversationId={id} />
      </div>
    </div>
  );
}
