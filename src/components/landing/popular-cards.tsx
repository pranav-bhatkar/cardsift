import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

import { CreditCardPreview } from "./credit-card-preview";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";

function PopularCards({
  popularCards,
}: {
  popularCards: CreditCardWithAllRelations[];
}) {
  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="container mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Popular Credit Cards</h2>
          <Link href="/compare">
            <Button variant="outline">
              View All Cards <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularCards.map((card) => (
            <CreditCardPreview key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularCards;
