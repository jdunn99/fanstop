import { UserSearchResult } from "@/lib/api/validators";
import { useCreateConversationMutation } from "@/lib/mutations/useCreateConversationMutation";
import { useUsersSearchResult } from "@/lib/queries/useUsersSearchResult";
import { useRouter } from "next/router";
import React from "react";
import { AvatarImage } from "../ui/avatar";

function ConversationSearchResult({
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

export function useConversationSearch() {
  const [query, setQuery] = React.useState<string>("");
  const { data: searchResults } = useUsersSearchResult(query);

  return { searchResults, query, setQuery };
}

export function ConversationSearch() {
  const { searchResults, query, setQuery } = useConversationSearch();

  return (
    <div className="relative flex-1 w-full h-full ">
      <input
        autoFocus
        className="h-full w-full !rounded-none border-r !border-l-0 !lg:border-y-0 border-slate-200 focus-visible:ring-0 focus-visible:outline-none p-4 text-slate-500 text-base bg-slate-50 lg:bg-white border-y "
        placeholder="Search for a user..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {typeof searchResults !== "undefined" ? (
        <div className="block lg:absolute z-50 bg-white w-full pl-4 lg:pl-0 lg:w-96 lg:top-16 lg:left-5 lg:rounded-lg  lg:shadow-lg lg:border mt-4 sm:mt-0">
          {searchResults.map((result) => (
            <ConversationSearchResult key={result.id} {...result} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
