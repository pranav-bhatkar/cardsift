// create and export Prisma client instance
import { Prisma, PrismaClient } from "@cc/generated/prisma";

export const prisma = new PrismaClient({
  log: [],
});

export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// mock data for credit cards
export const creditCardWithAllRelationsInclude = {
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
export type CreditCardWithAllRelations = Prisma.CreditCardGetPayload<{
  include: typeof creditCardWithAllRelationsInclude;
}>;
