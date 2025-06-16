import { z } from "zod";

// A schema for a single message part, aligning with the Vercel AI SDK
const messagePartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

// A schema for a single message, aligning with the Vercel AI SDK
const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user"]), // For a client request, the role must be 'user'
  content: z.string(),
  // The 'parts' field is often used for more complex, multi-modal inputs
  parts: z.array(messagePartSchema).optional(),
  // Attachments are experimental and optional
  experimental_attachments: z.any().optional(),
});

// The main schema for the entire POST request body
export const postRequestBodySchema = z.object({
  // The unique ID of the chat session
  id: z.string(),
  // The message object sent by the client
  message: messageSchema,
  // The AI model selected by the user on the frontend
  selectedChatModel: z.string(), // Or z.enum(['model1', 'model2']) if you have a fixed list
  // The visibility type for new chats
  selectedVisibilityType: z.enum(["private", "public", "unlisted"]),
  // Optional data object to provide extra context to the AI
  data: z
    .object({
      // Used for compare/single-card pages to focus the AI's context
      cardIds: z.array(z.string()).optional(),
    })
    .optional(),
});

// We can infer the TypeScript type directly from the Zod schema
export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
