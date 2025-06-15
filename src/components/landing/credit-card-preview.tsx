import { Star, ArrowRight } from "lucide-react";
import { Button } from "@cc/components/ui/button";
import { Badge } from "@cc/components/ui/badge";
import type { CreditCard } from "@cc/lib/data";
import Link from "next/link";

interface CreditCardPreviewProps {
  card: CreditCard;
}

export function CreditCardPreview({ card }: CreditCardPreviewProps) {
  return (
    <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{card.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{card.bank}</p>
          <Badge variant="secondary" className="text-xs">
            {card.cardType}
          </Badge>
        </div>
        <div className="w-16 h-10 bg-gradient-to-r from-primary/20 to-primary/10 rounded border flex-shrink-0"></div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Annual Fee:</span>
          <span className="font-medium">
            ₹{card.annualFee.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Joining Fee:</span>
          <span className="font-medium">
            ₹{card.joiningFee.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Key Benefits:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          {card.benefits.slice(0, 3).map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{card.rating}</span>
        </div>
        <Link href={`/card/${card.id}`}>
          <Button
            size="sm"
            variant="ghost"
            className="group-hover:bg-primary group-hover:text-primary-foreground"
          >
            View Details
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
