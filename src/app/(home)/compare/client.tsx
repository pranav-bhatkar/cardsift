"use client";

import { useState, useMemo } from "react";
import { ChevronRight, MessageCircle, Filter } from "lucide-react";
import { Button } from "@cc/components/ui/button";
import { Checkbox } from "@cc/components/ui/checkbox";
// import { Slider } from "@cc/components/ui/slider"
import { Badge } from "@cc/components/ui/badge";
import { CreditCardComparison } from "@cc/components/compare/credit-card-comparison";
import { ComparisonPanel } from "@cc/components/compare/comparison-panel";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";
import { useRouter } from "next/navigation";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function ComparePage({
  creditCards,
  banks,
}: {
  creditCards: CreditCardWithAllRelations[];
  banks: { id: string; name: string }[];
}) {
  const searchParams = useSearchParams();

  const bankids = searchParams.get("bankids");
  const searchCardTypes = searchParams.get("cardtypes");
  const router = useRouter();
  // const [annualFeeRange, setAnnualFeeRange] = useState([0, 15000]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCardData = creditCards.filter((card) =>
    selectedCards.includes(card.id),
  );

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : prev.length < 3
          ? [...prev, cardId]
          : prev,
    );
  };

  const clearFilters = () => {
    router.push("/compare");
    // setAnnualFeeRange([0, 15000]);
  };
  const currentCardTypes = searchCardTypes
    ? searchCardTypes.split(",").filter((t) => t !== "")
    : [];
  const currentBankIds = bankids
    ? bankids.split(",").filter((id) => id !== "")
    : [];
  const buildQueryString = (banks: string[], cardTypes: string[]) => {
    const params = new URLSearchParams();

    if (banks.length > 0) {
      params.set("bankids", banks.join(","));
    }

    if (cardTypes.length > 0) {
      params.set("cardtypes", cardTypes.join(","));
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  const handleBankFilterChange = (bankId: string, checked: CheckedState) => {
    const newBankIds = checked
      ? [...currentBankIds, bankId]
      : currentBankIds.filter((id) => id !== bankId);

    if (newBankIds.join(",") !== currentBankIds.join(",")) {
      const queryString = buildQueryString(newBankIds, currentCardTypes);
      router.push(`/compare${queryString}`);
    }
  };

  const handleCardTypeFilterChange = (
    cardType: string,
    checked: CheckedState,
  ) => {
    const newCardTypes = checked
      ? [...currentCardTypes, cardType]
      : currentCardTypes.filter((t) => t !== cardType);

    if (newCardTypes.join(",") !== currentCardTypes.join(",")) {
      const queryString = buildQueryString(currentBankIds, newCardTypes);
      router.push(`/compare${queryString}`);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-muted-foreground flex items-center space-x-2 text-sm">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Compare Cards</span>
          </nav>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="mb-4 w-full"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filter Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-card sticky top-24 rounded-lg border p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Bank Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium">Bank</h3>
                <div className="space-y-2">
                  {banks.map((bank) => (
                    <div key={bank.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={bank.id}
                        checked={currentBankIds.includes(bank.id)}
                        onCheckedChange={(checked) => {
                          handleBankFilterChange(bank.id, checked);
                        }}
                      />
                      <label
                        htmlFor={bank.id}
                        className="cursor-pointer text-sm"
                      >
                        {bank.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Type Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium">Card Type</h3>
                <div className="space-y-2">
                  {[
                    "Premium",
                    "Travel",
                    "Cashback",
                    "Business",
                    "Lifestyle",
                    "Fuel",
                  ].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={currentCardTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          handleCardTypeFilterChange(type, checked);
                        }}
                      />
                      <label htmlFor={type} className="cursor-pointer text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Annual Fee Range */}
              {/* <div className="mb-6">
                <h3 className="font-medium mb-3">Annual Fee Range</h3>
                <div className="px-2">
                  <Slider
                    value={annualFeeRange}
                    onValueChange={setAnnualFeeRange}
                    max={15000}
                    step={500}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{annualFeeRange[0].toLocaleString()}</span>
                    <span>₹{annualFeeRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold">
                  Compare Credit Cards
                </h1>
                <p className="text-muted-foreground">
                  Found {creditCards.length} cards matching your criteria
                </p>
              </div>

              {selectedCards.length > 0 && (
                <Badge variant="secondary" className="px-3 py-1">
                  {selectedCards.length} selected for comparison
                </Badge>
              )}
            </div>

            {/* Cards Grid */}
            <div className="mb-8 grid gap-4">
              {creditCards.map((card) => (
                <CreditCardComparison
                  key={card.id}
                  card={card}
                  isSelected={selectedCards.includes(card.id)}
                  onToggleSelection={toggleCardSelection}
                  disabled={
                    !selectedCards.includes(card.id) &&
                    selectedCards.length >= 3
                  }
                />
              ))}
            </div>

            {creditCards.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No cards match your current filters
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Panel */}
        {selectedCardData.length > 0 && (
          <ComparisonPanel
            cards={selectedCardData}
            onRemoveCard={toggleCardSelection}
          />
        )}

        {/* Floating AI Chat Button */}
        <Link href="/chat">
          <Button
            size="lg"
            className="fixed right-6 bottom-6 z-50 rounded-full shadow-lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Ask AI
          </Button>
        </Link>
      </div>
    </div>
  );
}
