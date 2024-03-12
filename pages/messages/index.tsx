import { ConversationContainer } from "@/components/conversations/conversation-container";
import { CreateConversationDrawerButton } from "@/components/conversations/create-conversation-drawer";
import { EmptyMessagesContainer } from "@/components/conversations/message-container";
import { CreateConversationButton } from "@/components/create-conversation";
import { Container } from "@/components/layout/container";
import { MessagesContainer } from "@/components/messages";
import { ProfileNav } from "@/components/nav";
import { NavDrawerOpenButton } from "@/components/nav-drawer";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SidebarDrawer } from "@/components/sidebar/sidebar-drawer";
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
