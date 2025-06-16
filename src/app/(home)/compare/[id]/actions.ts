"use server";

import {
  CreditCardWithAllRelations,
  creditCardWithAllRelationsInclude,
  prisma,
} from "@cc/lib/prisma";

export async function getCreditCardsByIds(creditCardIds: string[]) {
  const cards: CreditCardWithAllRelations[] = await prisma.creditCard.findMany({
    where: {
      id: {
        in: creditCardIds,
      },
    },
    include: creditCardWithAllRelationsInclude,
  });
  return cards;
}
export async function getCreditCardsByCompareId(id: string) {
  // Fetch comparison by ID
  const comparison = await prisma.compare.findUnique({
    where: { id },
    include: {
      creditCards: {
        include: creditCardWithAllRelationsInclude,
      },
    },
  });
  if (!comparison) {
    throw new Error("Comparison not found");
  }
  return comparison.creditCards;
}

export async function fetchUserProfile(id: string) {
  // Simulate fetching user profile data
  const userProfile = await prisma.user.findUnique({
    where: { id },
  });

  if (!userProfile) {
    throw new Error("User profile not found");
  }

  return userProfile;
}
