import { notFound } from "next/navigation";

import { Chat } from "@cc/components/chat";
import { DataStreamHandler } from "@cc/components/chat/data-stream-handler";

import { getChatById, getMessagesByChatId } from "../actions";
import { Suspense } from "react";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <Chat
        id={chat.id}
        initialMessages={messagesFromDb}
        isReadonly={false}
        // session={null}
        autoResume={false}
      />
      <DataStreamHandler id={id} />
    </Suspense>
  );
}
