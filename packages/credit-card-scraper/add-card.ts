import {
  prisma,
  findBankLogo,
  scrapeWebsite,
  getStructuredDataForAdd,
  transformForCreate,
} from "./lib/shared";
import { Bank } from "../../src/generated/prisma";

async function main(): Promise<void> {
  const url = process.argv[2];
  if (!url) {
    console.error("Error: Please provide a URL as a command-line argument.");
    console.error('Usage: npx ts-node add-card.ts "https://..."');
    process.exit(1);
  }

  const existingCardByUrl = await prisma.creditCard.findUnique({
    where: { sourceUrl: url },
  });
  if (existingCardByUrl) {
    console.error(
      `Error: A card with this source URL already exists (Name: ${existingCardByUrl.name}). Aborting.`,
    );
    process.exit(1);
  }

  const scrapeResult = await scrapeWebsite(url);

  if (scrapeResult.status === "error" || !scrapeResult.text) {
    console.error(`Failed to scrape website: ${scrapeResult.message}`);
    process.exit(1);
  }

  const structuredData = await getStructuredDataForAdd(scrapeResult.text);

  const existingCardByName = await prisma.creditCard.findUnique({
    where: { name: structuredData.name },
  });
  if (existingCardByName) {
    console.error(
      `Error: A card with the name "${structuredData.name}" already exists. Aborting.`,
    );
    process.exit(1);
  }

  console.log(`Handling bank: "${structuredData.bank}"...`);
  let bank: Bank | null = await prisma.bank.findUnique({
    where: { name: structuredData.bank },
  });

  if (!bank) {
    console.log(
      `Bank not found. Creating new entry for "${structuredData.bank}".`,
    );
    const logoUrl = await findBankLogo(structuredData.bank);
    bank = await prisma.bank.create({
      data: {
        name: structuredData.bank,
        image: logoUrl,
      },
    });
    console.log(`New bank created with ID: ${bank.id}`);
  } else {
    console.log(`Found existing bank with ID: ${bank.id}`);
  }

  console.log("Transforming AI data for database schema...");
  const prismaPayload = transformForCreate(
    structuredData,
    bank.id,
    url,
    scrapeResult.cardImageUrl,
  );

  console.log(`Saving card "${structuredData.name}" to the database...`);
  const newCard = await prisma.creditCard.create(prismaPayload);
  console.log("✅ Success!");
  console.log(`Successfully added card: ${newCard.name} (ID: ${newCard.id})`);
}

main()
  .catch((e) => {
    console.error("\n❌ An error occurred during the process:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
