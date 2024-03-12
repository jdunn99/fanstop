import { ConversationContainer } from "@/components/conversations/conversation-container";
import { EmptyMessagesContainer } from "@/components/conversations/message-container";
import { Container } from "@/components/layout/container";
import { ProfileNav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar/sidebar";
import React from "react";

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

export default function Messages() {
  return (
    <Container>
      <Sidebar />

      <div className="relative mx-auto overflow-auto flex w-full">
        <ConversationContainer />
        <EmptyMessagesContainer />
      </div>
    </Container>
  );
}

// export async function getServerSideProps {

// }
