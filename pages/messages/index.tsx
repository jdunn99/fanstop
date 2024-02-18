import { ConversationContainer } from "@/components/conversations";
import { CreateConversationButton } from "@/components/create-conversation";
import { MessagesContainer } from "@/components/messages";
import { ProfileNav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { createConversation } from "@/lib/api/conversations";
import { UserSearchResult } from "@/lib/api/validators";
import { useCreateConversationMutation } from "@/lib/mutations/useCreateConversationMutation";
import { useUsersSearchResult } from "@/lib/queries/useUsersSearchResult";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft, BsPlus, BsX } from "react-icons/bs";

interface MessagesLayoutProps {
  children?: React.ReactNode;
}
export function MessagesLayout({ children }: MessagesLayoutProps) {
  return (
    <div className="antialised " id="root">
      <ProfileNav />
      <div className="flex overflow-hidden">
        <aside className="hidden inset-y-0 z-10 flex-shrink-0 w-64 bg-white border-r md:static md:block">
          <Sidebar />
        </aside>
        <ConversationContainer />

        {children}
      </div>
    </div>
  );
}

function SearchResult({
  image,
  name,
  community,
  id,
  conversations,
}: UserSearchResult) {
  const router = useRouter();
  const conversation = conversations.length > 0 ? conversations[0].id : null;
  const { mutateAsync } = useCreateConversationMutation();

  async function onClick() {
    if (conversation === null) {
      const data = await mutateAsync([id]);

      console.log(data);
      if (typeof data !== "undefined") {
        router.push(`/messages/${data.id}`);
      }
    } else {
      router.push(`/messages/${conversation}`);
    }
  }

  return (
    <div
      onClick={onClick}
      className="flex items-center w-full gap-2 hover:bg-slate-50 cursor-pointer p-4 rounded-lg"
    >
      <AvatarImage src={image} />
      <div>
        <p className="font-semibold text-slate-800 text-sm">{name}</p>
        <p className="font-bold text-rose-500 text-sm">@{community.slug}</p>
      </div>
    </div>
  );
}

export default function Messages() {
  const [creating, setCreating] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const { data: searchResults } = useUsersSearchResult(searchQuery);

  return (
    <MessagesLayout>
      <div className=" w-full h-[calc(100vh-73px)] bg-slate-50 hidden lg:block">
        {creating ? (
          <div className="fixed w-full lg:w-[calc(100vw-40rem)] h-[73px] flex items-center bg-white border-b z-50 right-0">
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
    </MessagesLayout>
  );
}

// export async function getServerSideProps {

// }
