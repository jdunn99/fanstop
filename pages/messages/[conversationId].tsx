import { ConversationContainer } from "@/components/conversations";
import { useConversationByIDQuery } from "@/lib/queries/useConversationByIDQuery";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { z } from "zod";
import { MessagesLayout } from ".";
import { MessagesContainer } from "@/components/messages";
import React from "react";
import { useCreateConversationMutation } from "@/lib/mutations/useCreateConversationMutation";

export default function MessagesWithConversation({
  conversationId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useConversationByIDQuery(conversationId);

  if (typeof data === "undefined") {
    return null;
  }

  return (
    <MessagesLayout>
      <MessagesContainer id={conversationId} name={data.users[0].name} />
    </MessagesLayout>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      conversationId: z.string().parse(query.conversationId),
    },
  };
}