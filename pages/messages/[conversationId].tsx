import { ConversationContainer } from "@/components/conversations/conversation-container";
import { useConversationByIDQuery } from "@/lib/queries/useConversationByIDQuery";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { z } from "zod";
import { MessagesLayout } from ".";
import { MessagesContainer } from "@/components/conversations/message-container";
import React from "react";
import { useCreateConversationMutation } from "@/lib/mutations/useCreateConversationMutation";
import { Container } from "@/components/layout/container";
import { Sidebar } from "@/components/sidebar/sidebar";
import { EmptyMessagesContainer } from "@/components/conversations/message-container";
import { useWindowWidth } from "@/lib/useWindowWidth";

export default function MessagesWithConversation({
  conversationId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useConversationByIDQuery(conversationId);
  const isMobile = useWindowWidth();

  if (typeof data === "undefined") {
    return null;
  }

  return (
    <Container noHeight>
      <Sidebar />

      <div className="relative mx-auto overflow-auto flex w-full">
        <div className="hidden sm:block">
          <ConversationContainer />
        </div>
        <MessagesContainer id={data.id} name={data.users[0].name} />
      </div>
    </Container>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      conversationId: z.string().parse(query.conversationId),
    },
  };
}
