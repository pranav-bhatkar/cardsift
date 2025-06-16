"use server";
import { creditCardWithAllRelationsInclude, prisma } from "@cc/lib/prisma";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function generateCardSummary(id: string): Promise<{
  text?: string;
  success: boolean;
  message?: string;
}> {
  // ... existing code for request parsing, auth, entitlements ...
  // ... This part remains exactly the same ...
  try {
    const card = await prisma.creditCard.findUnique({
      where: { id },
      include: creditCardWithAllRelationsInclude,
    });
    if (!card) {
      return { success: false, message: "Card not found" };
    }
    const { text } = await generateText({
      model: google("gemini-2.5-flash-preview-05-20"),
      prompt: `
   You are an expert credit card summarizer. Your task is to create a concise, 2-3 sentence summary of the credit card, highlighting its primary benefits and features. and ideal user.

   **Credit Card Details:**
   ${JSON.stringify(card, null, 2)}
   `,
    });
    return {
      text,
      success: true,
    };
  } catch (error) {
    console.error("Error generating card summary:", error);
    return {
      success: false,
      message: "Failed to generate card summary",
    };
  }
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}
