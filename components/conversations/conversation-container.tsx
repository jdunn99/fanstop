import { useConversationsForUserQuery } from "@/lib/queries/conversation-queries";
import { SidebarDrawer } from "../sidebar/sidebar-drawer";
import Button from "../ui/button";
import Input from "../ui/input";
import { ConversationItem } from "../conversations";
import React from "react";

export function ConversationContainer() {
  const { data } = useConversationsForUserQuery();
  const [query, setQuery] = React.useState<string>("");

  return (
    <aside className="relative min-h-screen w-full md:w-96 bg-slate-100 pt-4 flex-shrink-0">
      <div className="max-sm:flex-1 relative w-full">
        <div className="px-2 pb-4">
          <div className="pb-4 flex items-center gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <SidebarDrawer />
              <h1 className="text-slate-800 font-medium">Conversations</h1>
            </div>
            {/* <CreateConversationDrawerButton /> */}
            <Button size="xs">+</Button>
          </div>

          <Input
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            className="w-full px-4"
            placeholder="Search messages"
          />
        </div>
        {typeof data !== "undefined"
          ? data.pages.map((page) =>
              page.response.map((conversation) => {
                const [user] = conversation.users;

                if (
                  !user.name
                    .toLocaleLowerCase()
                    .includes(query.toLocaleLowerCase())
                ) {
                  return null;
                }

                return (
                  <ConversationItem key={conversation.id} {...conversation} />
                );
              })
            )
          : null}
      </div>
    </aside>
  );
}
