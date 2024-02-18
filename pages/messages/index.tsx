import { ConversationContainer } from "@/components/conversations";
import { MessagesContainer } from "@/components/messages";
import { ProfileNav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";
import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";
import { BsArrowLeft, BsPlus } from "react-icons/bs";

interface MessagesLayoutProps {
  children?: React.ReactNode;
}
export function MessagesLayout({ children }: MessagesLayoutProps) {
  return (
    <div className="antialised " id="root">
      <ProfileNav />
      <div className="flex  overflow-hidden">
        <aside className="hidden inset-y-0 z-10 flex-shrink-0 w-64 bg-white border-r md:static lg:block">
          <Sidebar />
        </aside>
        <ConversationContainer />

        {children}
        {/* <MessagesContainer /> */}
      </div>
    </div>
  );
}

export default function Messages() {
  return <MessagesLayout />;
}

// export async function getServerSideProps {

// }
