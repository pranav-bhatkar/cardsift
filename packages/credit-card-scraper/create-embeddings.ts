import { Prisma, PrismaClient } from "../../src/generated/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
// mock data for credit cards
const creditCardWithAllRelationsInclude = {
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
} satisfies Prisma.CreditCardInclude;
type CreditCardWithAllRelations = Prisma.CreditCardGetPayload<{
  include: typeof creditCardWithAllRelationsInclude;
}>;
export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Define the type for the card object we'll fetch, including all relations.
// This gives us full type safety and autocompletion.

const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!,
);
const model = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

/**
 * Converts a card object with all its relations into a single text document.
 * This document is what the AI will embed.
 * @param card - The fully populated card object from Prisma.
 * @returns A single string containing all relevant information.
 */
function createDocumentForEmbedding(card: CreditCardWithAllRelations): string {
  const parts: string[] = [];

  parts.push(`Card Name: ${card.name}`);
  parts.push(`Bank: ${card.bank.name}`);
  parts.push(`Description: ${card.description}`);
  parts.push(`Card Type: ${card.cardType}`);
  parts.push(`Annual Fee: ${card.annualFee}, Joining Fee: ${card.joiningFee}`);

  if (card.feeWaiver) {
    parts.push(
      `Fee Waiver: Annual fee is waiverable by spending ${card.feeWaiver.annualFeeSpendThreshold}.`,
    );
  }

  if (card.welcomeBonus) {
    parts.push(`Welcome Bonus: ${card.welcomeBonus.description}`);
  }

  if (card.rewards) {
    const bonusCategories = card.rewards.bonusCategories
      .map((c) => `${c.cashbackPercentage}% on ${c.category}`)
      .join(", ");
    parts.push(
      `Rewards: ${bonusCategories}. Points expire in ${card.rewards.pointExpiry}.`,
    );
  }

  if (card.travelBenefits) {
    parts.push(
      `Travel: ${card.travelBenefits.loungeAccessDomestic} domestic and ${card.travelBenefits.loungeAccessInternational} international lounge visits. Forex markup is ${card.travelBenefits.forexMarkup}%.`,
    );
  }

  if (card.lifestyleBenefits) {
    parts.push(
      `Lifestyle: Offers dining benefits: ${card.lifestyleBenefits.diningIsAvailable}, movie benefits: ${card.lifestyleBenefits.moviesIsAvailable}.`,
    );
  }

  if (card.eligibilityCriteria) {
    parts.push(
      `Eligibility: Requires a minimum income of ${card.eligibilityCriteria.minIncome} and a credit score of ${card.eligibilityCriteria.minCreditScore}.`,
    );
  }

  return parts.join("\n");
}

/**
 * The main function to generate and store embeddings for all credit cards.
 */
async function main(): Promise<void> {
  console.log("Fetching all cards with their relations from the database...");

  // 1. Fetch all cards and deeply include all related data
  const cards: CreditCardWithAllRelations[] = await prisma.creditCard.findMany({
    include: creditCardWithAllRelationsInclude,
  });

  if (cards.length === 0) {
    console.log("No cards found in the database. Please add cards first.");
    return;
  }

  console.log(`Found ${cards.length} cards. Generating embeddings...`);

  let successCount = 0;
  let errorCount = 0;

  for (const card of cards) {
    // 2. Create the comprehensive text document for this card
    const textToEmbed = createDocumentForEmbedding(card);

    try {
      // 3. Generate the embedding from the text document
      const result = await model.embedContent(textToEmbed);
      const embedding: number[] = result.embedding.values;

      if (embedding.length !== 768) {
        throw new Error(
          `Generated embedding has incorrect dimensions: ${embedding.length}`,
        );
      }

      // 4. Store the new embedding in the database
      await prisma.$executeRawUnsafe(
        `UPDATE "CreditCard" SET embedding = '[${embedding.join(
          ",",
        )}]' WHERE id = $1`,
        card.id,
      );

      console.log(
        `✅ Successfully generated and stored embedding for: ${card.name}`,
      );
      successCount++;
    } catch (error: any) {
      console.error(`❌ Failed to process card ${card.name}:`, error.message);
      errorCount++;
    }
  }

  console.log("\n--- Embedding Generation Complete ---");
  console.log(`Success: ${successCount}`);
  console.log(`Errors:  ${errorCount}`);
}

// Execute the main function and handle potential errors
main()
  .catch((e) => {
    console.error("An unexpected error occurred:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
