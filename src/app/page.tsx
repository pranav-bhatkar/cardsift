import FeaturesSection from "@cc/components/landing/features";
import HeroSection from "@cc/components/landing/hero";
import PopularCards from "@cc/components/landing/popular-cards";

import {
  prisma,
  CreditCardWithAllRelations,
  creditCardWithAllRelationsInclude,
} from "@cc/lib/prisma";

export default async function Home() {
  const cards: CreditCardWithAllRelations[] = await prisma.creditCard.findMany({
    take: 6,
    include: creditCardWithAllRelationsInclude,
  });
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PopularCards popularCards={cards} />
    </>
  );
}
