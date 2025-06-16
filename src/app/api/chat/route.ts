// app/api/chat/route.ts

// --- All your existing imports ---
import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  streamText,
  UIMessage,
  TextPart,
  smoothStream,
  tool,
} from "ai";
// ... etc.
import { google } from "@ai-sdk/google";

// --- NEW IMPORT ---
import { getContext } from "@cc/lib/ai-context";
import { postRequestBodySchema } from "./schema";
import { generateUUID, getTrailingMessageId } from "@cc/lib/utils";
import { after } from "next/server";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import { prisma } from "@cc/lib/prisma";
import { Chat } from "@cc/generated/prisma";
import { differenceInSeconds } from "date-fns";
import { getMessagesByChatId } from "@cc/app/chat/actions";
import z from "zod";
export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL",
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}
export async function POST(request: Request) {
  // ... existing code for request parsing, auth, entitlements ...
  // ... This part remains exactly the same ...
  try {
    const { id, message, cardIds } = postRequestBodySchema.parse(
      await request.json(),
    );

    // ... all your logic for message limits, saving chats, etc. ...
    const chat = await prisma.chat.findUnique({
      where: { id },
    });

    if (!chat) {
      await prisma.chat.create({
        data: {
          id,
          title: `Chat-${id}`,
        },
      });
    }

    const previousMessages = await getMessagesByChatId({ id });

    const messages = appendClientMessage({
      messages: previousMessages,
      message,
    });

    await prisma.message.create({
      data: {
        chatId: id,
        role: "user",
        parts:
          message.parts?.map((part) => ({
            text: part.text,
            type: part.type,
          })) || [],
        attachments: [],
        createdAt: new Date(),
      },
    });

    const streamId = generateUUID();
    await prisma.stream.create({
      data: {
        id: streamId,
        chat: {
          connect: {
            id,
          },
        },
      },
    });

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: google("gemini-2.5-flash-preview-05-20"), // Use the model selected by the user
          // system: finalSystemPrompt,
          // messages,
          // maxSteps: 5,
          // experimental_transform: smoothStream({ chunking: "word" }),
          // experimental_generateMessageId: generateUUID,
          system: `
            You are an expert credit card advisor. Your personality is helpful, respectful, and engaging.
            Format your answers clearly using Markdown, including lists, bold text, and tables where appropriate.
            Note: 
             IMPORTANT: Do not use any prior knowledge or external information.
             IMPORTANT: Use the fetchCardContext tool to get information about credit cards.
            IMPORTANT: Only use the fetchCardContext tool for credit card related questions.
            IMPORTANT: If the answer is not in the CONTEXT, you must say "I do not have enough information to answer that."
            `,
          messages,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools: {
            fetchCardContext: tool({
              parameters: z.object({
                query: z
                  .string()
                  .describe(
                    "The user's query about credit cards or related topics.",
                  ),
              }),
              description:
                "Fetch context information about credit cards for the user's query. only use this tool for credit card related questions.",
              execute: async ({ query }) => {
                const { contextCards } = await getContext(query, cardIds);
                return JSON.stringify(contextCards, null, 2);
              },
            }),
          },
          onFinish: async ({ response }) => {
            try {
              const assistantId = getTrailingMessageId({
                messages: response.messages.filter(
                  (message) => message.role === "assistant",
                ),
              });
              if (!assistantId) {
                throw new Error("No assistant message found!");
              }
              console.log("Saving chat with ID:", id);
              const [, assistantMessage] = appendResponseMessages({
                messages: [message],
                responseMessages: response.messages,
              });
              console.log("Assistant message:", assistantMessage);
              // conver assistantMessage parts to prisma JSON type
              const parts = assistantMessage.parts?.map((part: any) => ({
                text: (part as { type: "text"; text: string }).text, // Type assertion
                type: part.type,
              }));
              await prisma.message.create({
                data: {
                  chatId: id,
                  role: "assistant",
                  parts: (assistantMessage.parts as any) || [],
                  attachments: [],
                  createdAt: new Date(),
                },
              });
            } catch (_) {
              console.error("Failed to save chat");
            }
          },
          experimental_telemetry: {
            isEnabled: false,
            functionId: "stream-text",
          },
        });
        result.consumeStream();
        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (e) => {
        console.log("Error in stream:", e);
        return "Oops, an error occurred!";
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () => stream),
      );
    } else {
      return new Response(stream);
    }
  } catch (_) {
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}

export async function GET(request: Request) {
  const streamContext = getStreamContext();
  const resumeRequestedAt = new Date();

  if (!streamContext) {
    return new Response(null, { status: 204 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("id is required", { status: 400 });
  }

  let chat: Chat;

  try {
    chat = await prisma.chat.findUniqueOrThrow({
      where: { id: chatId },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }

  if (!chat) {
    return new Response("Not found", { status: 404 });
  }

  const streamIds = await prisma.stream.findMany({
    where: { chatId },
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });

  if (!streamIds.length) {
    return new Response("No streams found", { status: 404 });
  }

  const recentStreamId = streamIds.map((stream) => stream.id)[0];

  if (!recentStreamId) {
    return new Response("No recent stream found", { status: 404 });
  }

  const emptyDataStream = createDataStream({
    execute: () => {},
  });

  const stream = await streamContext.resumableStream(
    recentStreamId,
    () => emptyDataStream,
  );

  /*
   * For when the generation is streaming during SSR
   * but the resumable stream has concluded at this point.
   */
  if (!stream) {
    const messages = await getMessagesByChatId({ id: chatId });
    const mostRecentMessage = messages.at(-1);

    if (!mostRecentMessage) {
      return new Response(emptyDataStream, { status: 200 });
    }

    if (mostRecentMessage.role !== "assistant") {
      return new Response(emptyDataStream, { status: 200 });
    }

    const messageCreatedAt = new Date(
      mostRecentMessage.createdAt || Date.now(),
    );

    if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
      return new Response(emptyDataStream, { status: 200 });
    }

    const restoredStream = createDataStream({
      execute: (buffer) => {
        buffer.writeData({
          type: "append-message",
          message: JSON.stringify(mostRecentMessage),
        });
      },
    });

    return new Response(restoredStream, { status: 200 });
  }

  return new Response(stream, { status: 200 });
}
