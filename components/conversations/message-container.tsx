import { useUsersSearchResult } from "@/lib/queries/useUsersSearchResult";
import React from "react";
import { BsArrowLeft, BsX } from "react-icons/bs";
import Button from "../ui/button";
import { SearchResult } from "./conversation-search-result";
import Link from "next/link";
import { MessageList } from "./message-list";
import { MessagesInput } from "./message-input";

export function EmptyMessagesContainer() {
  const [creating, setCreating] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const { data: searchResults } = useUsersSearchResult(searchQuery);

  return (
    <div className="relative min-h-screen  w-full mx-auto break-words hidden md:block">
      {creating ? (
        <div className="border-b">
          <div className="relative w-full h-full">
            <div className="flex items-center gap-4 w-full justify-between h-full pr-6">
              <div className="relative flex-1 w-full h-full pl-2">
                <input
                  autoFocus
                  className="h-full w-full !rounded-none border-r !border-l-0 !border-y-0 border-slate-200 focus-visible:ring-0 focus-visible:outline-none p-4 text-slate-500 text-base"
                  placeholder="Search for a user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {typeof searchResults !== "undefined" ? (
                  <div className="absolute z-50 bg-white w-96 top-16 left-5 rounded-lg  shadow-lg border">
                    {searchResults.map((result) => (
                      <SearchResult key={result.id} {...result} />
                    ))}
                  </div>
                ) : null}
              </div>
              <Button variant="ghost" onClick={() => setCreating(false)}>
                <BsX />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full text-sm text-slate-600 h-full flex items-center justify-center flex-col gap-4">
          <p>Select a conversation to begin messaging.</p>
          <p className="font-semibold">- Or -</p>
          <Button onClick={() => setCreating(true)}>
            Start a new conversation
          </Button>
        </div>
      )}
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
  }, [handleResize]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize();
    }
  }, [handleResize]);

  return (
    <div className="min-h-screen w-full" ref={ref}>
      <div className="fixed w-full px-6 py-[1.5rem] lg:w-[calc(100vw-704px)] bg-white border-b z-50 right-0">
        <div className="flex items-center p-0 gap-4">
          <Link href="/messages">
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
