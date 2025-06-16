import { CardType } from "@cc/generated/prisma";
import { creditCardWithAllRelationsInclude, prisma } from "@cc/lib/prisma";
import React from "react";
import ComparePage from "./client";

async function page({
  searchParams,
}: {
  searchParams?: Promise<{
    bankids?: string;
    cardtypes?: string;
  }>;
}) {
  const s = await searchParams;
  const bankIds = s?.bankids?.split(",") || [];
  const cardTypeb = s?.cardtypes?.split(",") || [];
  const cardTypes: CardType[] = cardTypeb.map((type) => type as CardType);
  const conditions = [];

  if (bankIds.length > 0) {
    conditions.push({
      bank: {
        id: {
          in: bankIds,
        },
      },
    });
  }

  if (cardTypes.length > 0) {
    conditions.push({
      cardType: {
        in: cardTypes,
      },
    });
  }

  const cards = await prisma.creditCard.findMany({
    where:
      conditions.length > 0
        ? {
            OR: conditions,
          }
        : {},
    include: creditCardWithAllRelationsInclude,
  });
  const banks = await prisma.bank.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return <ComparePage creditCards={cards} banks={banks} />;
}

export default page;
