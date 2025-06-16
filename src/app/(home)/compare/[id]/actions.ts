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
