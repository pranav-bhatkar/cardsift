// app/api/chat/route.ts

// --- All your existing imports ---
import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  streamText,
} from "ai";
// ... etc.
import { google } from "@ai-sdk/google";

// --- NEW IMPORT ---
import { getContext } from "@cc/lib/ai-context";
import { postRequestBodySchema } from "./schema";

// ... all your existing setup code (getStreamContext, etc.) ...

export async function POST(request: Request) {
  // ... existing code for request parsing, auth, entitlements ...
  // ... This part remains exactly the same ...
  try {
    const { id, message, data } = postRequestBodySchema.parse(
      await request.json(),
    );

    // ... all your logic for message limits, saving chats, etc. ...
    // ... This part also remains the same ...

    const previousMessages = await getMessagesByChatId({ id });
    const messages = appendClientMessage({
      messages: previousMessages,
      message,
    });

    // --- MODIFIED SECTION START ---

    const userQuery = message.content;
    const cardIds = data?.cardIds; // Get cardIds from the request body

    // 1. Get the dynamic context from our new function
    const { contextCards } = await getContext(userQuery, cardIds);

    // 2. Create the final system prompt with the retrieved context
    const finalSystemPrompt = `
      You are an expert credit card advisor. Your personality is helpful, respectful, and engaging.
      You will answer the user's question based ONLY on the provided credit card data in the CONTEXT section.
      Do not use any prior knowledge. If the answer is not in the CONTEXT, you must say "I do not have enough information to answer that."
      Format your answers clearly using Markdown, including lists, bold text, and tables where appropriate.

      CONTEXT:
      ${JSON.stringify(contextCards, null, 2)}
    `;

    // --- MODIFIED SECTION END ---

    await saveMessages({
      // ... your existing saveMessages call ...
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: google("gemini-2.5-pro-preview-05-06"), // Use the model selected by the user
          // 3. Use our new dynamic prompt
          system: finalSystemPrompt,
          messages,
          // 4. For this credit card bot, we don't need external tools.
          // This simplifies the logic and focuses the AI on its main task.
          tools: {},
          onFinish: async ({ response }) => {
            // ... your existing onFinish logic is perfect and remains the same ...
          },
          // ... your existing telemetry config ...
        });

        result.consumeStream();
        result.mergeIntoDataStream(dataStream);
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    // ... your existing resumable stream logic is perfect and remains the same ...
  } catch (error) {
    console.error(error); // Log the actual error
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}

// ... your GET and DELETE functions remain exactly the same ...
