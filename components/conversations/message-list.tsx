import { useMessagesForConversation } from "@/lib/queries/conversation-queries";
import { useSession } from "next-auth/react";
import React from "react";
import { MessageItem } from "./message-item";

export function MessageList({ id }: { id: string }) {
  const { data: session } = useSession();
  const { data: messages } = useMessagesForConversation(id);

  React.useEffect(() => {
    if (typeof messages !== "undefined") {
      const newMessage = messages.pages[messages.pages.length - 1].response[0];

      if (!newMessage) {
        return;
      }

      const element = document.getElementById(newMessage.id);

      if (!element) {
        return;
      }

      element.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages?.pages.length]);

  if (session === null) {
    return null;
  }

  return (
    <div
      id="list"
      className="overflow-auto flex-1 h-full px-4 mt-12 py-2 gap-8 w-full !flex !flex-col-reverse mb-8 "
    >
      {typeof messages !== "undefined"
        ? messages.pages.map((page) =>
            page.response.map((message) => (
              <MessageItem
                isOwn={message.userId === session.user.id}
                {...message}
                key={message.id}
              />
            ))
          )
        : null}
    </div>
  );
}
