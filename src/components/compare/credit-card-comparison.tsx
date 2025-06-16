import { Star, ArrowRight } from "lucide-react";
import { Button } from "@cc/components/ui/button";
import { Badge } from "@cc/components/ui/badge";
import { Checkbox } from "@cc/components/ui/checkbox";

import Link from "next/link";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";

interface CreditCardComparisonProps {
  card: CreditCardWithAllRelations;
  isSelected: boolean;
  onToggleSelection: (cardId: string) => void;
  disabled?: boolean;
}

export function CreditCardComparison({
  card,
  isSelected,
  onToggleSelection,
  disabled = false,
}: CreditCardComparisonProps) {
  return (
    <div
      onClick={() => onToggleSelection(card.id)}
      className={`bg-card cursor-pointer rounded-lg border p-6 transition-all duration-200 ${
        isSelected ? "ring-primary ring-2" : "hover:shadow-md"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-6">
        {/* Card Image */}
        <div className="from-primary/20 to-primary/10 h-12 w-20 flex-shrink-0 rounded border bg-gradient-to-r"></div>

        {/* Card Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold">{card.name}</h3>
              <p className="text-muted-foreground mb-2">{card.bank.name}</p>
              <Badge variant="secondary">{card.cardType}</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{card.rating}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelection(card.id)}
                  disabled={disabled}
                />
                <label className="text-sm font-medium">Compare</label>
              </div>
            </div>
          </div>

          <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">Annual Fee</p>
              <p className="font-semibold">
                ₹{card.annualFee.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Joining Fee</p>
              <p className="font-semibold">
                ₹{card.joiningFee.toLocaleString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground mb-1 text-sm">Key Benefits</p>
              <div className="flex flex-wrap gap-1">
                {card.benefits.slice(0, 2).map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {benefit.split(" ").slice(0, 3).join(" ")}...
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">{card.description}</p>
            <Link href={`/card/${card.id}`}>
              <Button variant="outline" size="sm">
                View Details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
