"use server";

import { prisma } from "@cc/lib/prisma";

export async function createComparisonAction(
  cardIds: string[],
): Promise<{ success: boolean; id?: string; message?: string }> {
  try {
    const comparisonId = await prisma.compare.create({
      data: {
        creditCards: {
          connect: cardIds.map((id) => ({ id })),
        },
      },
    });

    return {
      success: true,
      id: comparisonId.id,
      message: "Comparison created successfully.",
    };
  } catch (error) {
    console.error("Error creating comparison:", error);
    return { success: false, message: "Failed to create comparison." };
  }
}
