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
    <div className="bg-card group rounded-lg border p-6 transition-all duration-200 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold">{card.name}</h3>
          <p className="text-muted-foreground mb-2 text-sm">{card.bank}</p>
          <Badge variant="secondary" className="text-xs">
            {card.cardType}
          </Badge>
        </div>
        <div className="from-primary/20 to-primary/10 h-10 w-16 flex-shrink-0 rounded border bg-gradient-to-r"></div>
      </div>

      <div className="mb-4 space-y-2">
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
        <h4 className="mb-2 text-sm font-medium">Key Benefits:</h4>
        <ul className="text-muted-foreground space-y-1 text-xs">
          {card.benefits.slice(0, 3).map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="bg-primary mt-2 mr-2 h-1 w-1 flex-shrink-0 rounded-full"></span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
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
