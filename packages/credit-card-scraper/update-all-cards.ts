import {
  prisma,
  delay,
  scrapeWebsite,
  getStructuredDataForUpdate,
  prismaCardToAiData,
  transformForUpdate,
  FullCreditCard,
} from "./lib/shared";

const fullCardInclude = {
  feeWaiver: true,
  welcomeBonus: { include: { vouchers: true } },
  fees: true,
  rewards: { include: { bonusCategories: true, milestones: true } },
  redemption: { include: { airlinePartners: true, hotelPartners: true } },
  travelBenefits: true,
  lifestyleBenefits: true,
  eligibilityCriteria: true,
  finePrint: true,
};

async function main() {
  console.log("Starting the credit card update process...");
  const allCards = await prisma.creditCard.findMany({
    include: fullCardInclude,
  });

  console.log(`Found ${allCards.length} cards to update.`);

  for (const card of allCards) {
    console.log(`\n--- Updating card: ${card.name} (ID: ${card.id}) ---`);
    try {
      const scrapeResult = await scrapeWebsite(card.sourceUrl);

      if (scrapeResult.status === "error" || !scrapeResult.text) {
        console.error(
          `Skipping update for "${card.name}" due to scraping error: ${scrapeResult.message}`,
        );
        continue;
      }

      const existingDataJson = JSON.stringify(
        prismaCardToAiData(card as FullCreditCard),
        null,
        2,
      );
      const updatedAiData = await getStructuredDataForUpdate(
        existingDataJson,
        scrapeResult.text,
      );

      const updatePayload = transformForUpdate(
        updatedAiData,
        scrapeResult.cardImageUrl,
      );

      await prisma.creditCard.update({
        where: { id: card.id },
        data: updatePayload,
      });

      console.log(`✅ Successfully updated "${card.name}".`);
    } catch (error) {
      console.error(
        `❌ Failed to update "${card.name}". Error:`,
        (error as Error).message,
      );
    }

    console.log("Waiting for 10 seconds before next card...");
    await delay(10000);
  }

  console.log("\nUpdate process finished.");
}

main()
  .catch((e) => {
    console.error("\n❌ An unexpected error stopped the update process:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
