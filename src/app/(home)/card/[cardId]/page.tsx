// app/cards/[slug]/page.tsx

import { notFound } from "next/navigation";
import { creditCardWithAllRelationsInclude, prisma } from "@cc/lib/prisma";
import CardDetailPage from "./client"; // <-- Importing the client part

// ... (generateStaticParams, revalidate)

export default async function Page({
  params,
}: {
  params: Promise<{
    cardId: string;
  }>;
}) {
  const { cardId } = await params;

  if (!cardId) {
    notFound();
  }
  // 1. This is a Server Component (no "use client")
  // 2. It can be async, so you can `await` your Prisma query directly.
  const card = await prisma.creditCard.findFirst({
    where: { id: cardId },
    include: creditCardWithAllRelationsInclude,
  });

  if (!card) {
    notFound();
  }

  // 3. It fetches all the data on the server.
  const relatedCards = await prisma.creditCard.findMany({
    where: {
      bankId: card.bankId,
      id: { not: card.id }, // Exclude the current card
    },
    include: creditCardWithAllRelationsInclude,
    take: 3, // Limit to 3 related cards
    orderBy: { createdAt: "desc" }, // Optional: Order by creation date
  });

  // 4. It passes the fetched data down as props.
  return <CardDetailPage card={card} relatedCards={relatedCards} />;
}
