"use client";

import type { UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type { Vote } from "@cc/generated/prisma";
import { fetcher, generateUUID } from "@cc/lib/utils";

import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import { toast } from "./toast";
import { useSearchParams } from "next/navigation";
import { useAutoResume } from "@cc/hooks/use-auto-resume";
import { ChatHeader } from "./chat-header";

export function Chat({
  id,
  initialMessages,
  isReadonly,
  // session,
  autoResume,
  cardIds,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  isReadonly: boolean;
  // session: Session;
  autoResume: boolean;
  cardIds?: string[];
}) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    experimental_resume,
    data,
  } = useChat({
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    experimental_prepareRequestBody: (body) => ({
      id,
      message: body.messages.at(-1),
      cardIds,
    }),
    onFinish: (m) => {
      console.log("Message finished:", m);
    },
    onError: (error) => {
      toast({
        type: "error",
        description: error.message,
      });
    },
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      append({
        role: "user",
        content: query,
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, append, hasAppendedQuery, id]);

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher,
  );

  useAutoResume({
    autoResume,
    initialMessages,
    experimental_resume,
    data,
    setMessages,
  });

  return (
    <>
      <div className="bg-background flex h-[calc(100dvh-64px)] min-w-0 flex-col">
        <ChatHeader />
        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />

        <form className="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              setMessages={setMessages}
            />
          )}
        </form>
      </div>
    </>
  );
}
