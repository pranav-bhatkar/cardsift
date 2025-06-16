"use server";

import { prisma } from "@cc/lib/prisma";
import { UIMessage } from "ai";

export async function deleteTrailingMessages({ id }: { id: string }) {
  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    throw new Error(`Message with id ${id} not found`);
  }
  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await prisma.message.findMany({
      where: {
        chatId,
        createdAt: {
          gte: timestamp,
        },
      },
      select: {
        id: true,
      },
    });

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await prisma.vote.deleteMany({
        where: {
          chatId,
          messageId: {
            in: messageIds,
          },
        },
      });

      return await prisma.message.deleteMany({
        where: {
          chatId,
          id: {
            in: messageIds,
          },
        },
      });
    }
  } catch (error) {
    console.error(
      "Failed to delete messages by id after timestamp from database",
    );
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    // Delete all related votes, messages, and streams
    await prisma.vote.deleteMany({
      where: { chatId: id },
    });

    await prisma.message.deleteMany({
      where: { chatId: id },
    });

    await prisma.stream.deleteMany({
      where: { chatId: id },
    });

    // Delete the chat and return it
    const deletedChat = await prisma.chat.delete({
      where: { id },
    });

    return deletedChat;
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}
export async function getChatById({ id }: { id: string }) {
  try {
    const selectedChat = await prisma.chat.findUnique({
      where: { id },
    });
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    const votes = await prisma.vote.findMany({
      where: { chatId: id },
    });
    return votes;
  } catch (error) {
    console.error("Failed to get votes by chat id from database");
    throw error;
  }
}
export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    console.log(
      `Voting message with chatId: ${chatId}, messageId: ${messageId}, type: ${type}`,
    );
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error(`Message with id ${messageId} not found`);
    }
    const updateMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        votes: {
          upsert: {
            create: {
              chat: { connect: { id: chatId } },
              isUpvoted: type === "up",
            },
            update: {
              isUpvoted: type === "up",
            },
            where: {
              chatId_messageId: {
                chatId,
                messageId,
              },
            },
          },
        },
      },
    });
    console.log("Message updated with votes:", updateMessage);
    return updateMessage;
  } catch (error) {
    console.error("Failed to vote message in database");
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: id },
      orderBy: {
        createdAt: "asc",
      },
    });
    const newMessages: UIMessage[] = messages.map((message) => {
      const parts = message.parts as { text?: string; type: string }[];
      const content = parts.map((part) => part.text).join("");
      return {
        id: message.id,
        role: message.role as UIMessage["role"],
        parts: message.parts as UIMessage["parts"],
        createdAt: message.createdAt,
        content: content,
      };
    });
    return newMessages;
  } catch (error) {
    console.error("Failed to get messages by chat id from database");
    throw error;
  }
}
