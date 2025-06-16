"use client";

import { X, Star } from "lucide-react";
import { Button } from "@cc/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";
import { toast } from "sonner";
import { createComparisonAction } from "@cc/app/(home)/compare/action";

interface ComparisonPanelProps {
  cards: CreditCardWithAllRelations[];
  onRemoveCard: (cardId: string) => void;
}

export function ComparisonPanel({ cards, onRemoveCard }: ComparisonPanelProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  if (cards.length === 0) return null;

  const handleCompareDetails = async () => {
    if (cards.length === 0) return;

    setIsNavigating(true);
    const { success, id, message } = await createComparisonAction(
      cards.map((card) => card.id),
    );
    if (success) {
      toast.success("Comparison created successfully.");
      router.push(`/compare/${id}`);
    } else {
      toast.error(message || "Failed to create comparison.");
    }
  };

  return (
    <div className="bg-card fixed right-0 bottom-0 left-0 z-40 border-t shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Card Comparison ({cards.length})
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompareDetails}
            disabled={cards.length === 0 || isNavigating}
          >
            {isNavigating ? "Loading..." : "Compare Details"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-background relative rounded-lg border p-4"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => onRemoveCard(card.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="pr-8">
                <h4 className="mb-1 font-medium">{card.name}</h4>
                <p className="text-muted-foreground mb-2 text-sm">
                  {card.bank.name}
                </p>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Fee:</span>
                    <span className="font-medium">
                      ₹{card.annualFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <div className="flex items-center">
                      <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{card.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
