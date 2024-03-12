import { useCreateMessageMutation } from "@/lib/mutations/useCreateMessageMutation";
import React from "react";
import Button from "../ui/button";
import Textarea from "../ui/textarea";

interface MessagesInputProps {
  conversationId: string;
}
export function MessagesInput({ conversationId }: MessagesInputProps) {
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
