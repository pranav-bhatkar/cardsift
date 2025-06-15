import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { creditCards } from "@cc/lib/data";
import { CreditCardPreview } from "./credit-card-preview";

function PopularCards() {
  const popularCards = creditCards.slice(0, 6);
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Popular Credit Cards</h2>
          <Link href="/compare">
            <Button variant="outline">
              View All Cards <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCards.map((card) => (
            <CreditCardPreview key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularCards;
