// app/lib/ai-context.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

/**
 * Retrieves the relevant credit card context from the database.
 * If cardIds are provided, it fetches those specific cards.
 * Otherwise, it performs a RAG search using the vector column in PostgreSQL.
 */
export async function getContext(query: string, cardIds?: string[]) {
  // Scenario 1: Specific cards are requested (Compare or Single Card Page)
  if (cardIds && cardIds.length > 0) {
    console.log(`Context: Filtering for specific cards: ${cardIds.join(", ")}`);
    const contextCards = await prisma.creditCard.findMany({
      where: { id: { in: cardIds } },
      // Deeply include all relations for the context
      include: {
        bank: true,
        feeWaiver: true,
        welcomeBonus: { include: { vouchers: true } },
        fees: true,
        rewards: { include: { bonusCategories: true, milestones: true } },
        redemption: { include: { airlinePartners: true, hotelPartners: true } },
        travelBenefits: true,
        lifestyleBenefits: true,
        eligibilityCriteria: true,
        finePrint: true,
      },
    });
    return { contextCards };
  }

  // Scenario 2: No specific cards, perform a RAG search (Explore Page)
  console.log("Context: Performing RAG vector search for query:", query);
  const queryEmbeddingResult = await embeddingModel.embedContent(query);
  const queryEmbedding = queryEmbeddingResult.embedding.values;

  // ==================================================================
  // THE FIX IS HERE
  // ==================================================================

  // 1. Prepare the vector string for the query parameter.
  const vectorQueryString = `[${queryEmbedding.join(",")}]`;

  // 2. Use a parameterized query and cast the parameter to the vector type.
  const similarCards = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM "CreditCard"
    ORDER BY embedding <=> ${vectorQueryString}::vector
    LIMIT 5;
  `;
  // ==================================================================

  const relevantCardIds = similarCards.map((card) => card.id);

  if (relevantCardIds.length === 0) {
    return { contextCards: [] };
  }

  const contextCards = await prisma.creditCard.findMany({
    where: { id: { in: relevantCardIds } },
    // Also deeply include relations for the RAG results
    include: {
      bank: true,
      feeWaiver: true,
      welcomeBonus: { include: { vouchers: true } },
      fees: true,
      rewards: { include: { bonusCategories: true, milestones: true } },
      redemption: { include: { airlinePartners: true, hotelPartners: true } },
      travelBenefits: true,
      lifestyleBenefits: true,
      eligibilityCriteria: true,
      finePrint: true,
    },
  });

  return { contextCards };
}
