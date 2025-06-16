import { cookies } from "next/headers";
import { Chat } from "@cc/components/chat";
import { generateUUID } from "@cc/lib/utils";
import { DataStreamHandler } from "@cc/components/chat/data-stream-handler";
import { Suspense } from "react";

export default async function Page() {
  const id = generateUUID();

  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        isReadonly={false}
        autoResume={false}
      />
      <DataStreamHandler id={id} />
    </Suspense>
  );
}
