// app/cards/[slug]/CardDetailPageClient.tsx

"use client";

import { motion } from "motion/react"; // Using framer-motion is more common
import Link from "next/link";
import {
  ChevronRight,
  Star,
  CreditCard,
  Gift,
  Plane,
  Car,
  Phone,
  ArrowRight,
  Utensils,
  Film,
  Sparkles,
  FileText,
} from "lucide-react";

import { Button } from "@cc/components/ui/button";
import { Badge } from "@cc/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cc/components/ui/tabs";
import { CreditCardPreview } from "@cc/components/landing/credit-card-preview";
import type { CreditCard as CreditCardType } from "@cc/generated/prisma"; // Basic type for related cards
import { CreditCardWithAllRelations } from "@cc/lib/prisma";
import { toast } from "sonner";
import { generateCardSummary } from "@cc/app/action";
import { useEffect, useState } from "react";

export default function CardDetailPage({
  card,
  relatedCards = [], // Default to empty array
}: {
  card: CreditCardWithAllRelations;
  relatedCards?: CreditCardType[];
}) {
  // The notFound() in the parent component handles the null case,
  // so this check is for client-side safety.
  if (!card) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Card Not Found</h1>
          <Link href="/compare">
            <Button>Back to Compare</Button>
          </Link>
        </div>
      </div>
    );
  }
  const [aiSummary, setAiSummary] = useState<string>("");
  async function getAiSummary() {
    const { success, message, text } = await generateCardSummary(card.id);
    if (success) {
      toast.success("AI Summary generated successfully!");
      setAiSummary(text || "No summary available.");
    } else {
      toast.error(message || "Failed to generate AI summary.");
      setAiSummary("Failed to generate AI summary.");
    }
  }
  useEffect(() => {
    // Fetch AI summary when the component mounts
    getAiSummary();
  }, [card.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen"
    >
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-muted-foreground flex items-center space-x-2 text-sm">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/compare" className="hover:text-foreground">
              Compare Cards
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{card.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {card.cardType}
                </Badge>
                <h1 className="mb-2 text-4xl font-bold">{card.name}</h1>
                <p className="text-muted-foreground mb-4 text-xl">
                  {card.bank.name}
                </p>
                <div className="mb-4 flex items-center">
                  <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{card.rating}</span>
                  <span className="text-muted-foreground ml-2">
                    (Based on expert analysis)
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                {card.description}
              </p>
              <p className="text-muted-foreground mb-6 text-lg">
                AI Summary:{" "}
                <span className="text-muted-foreground">{aiSummary}</span>
              </p>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">Annual Fee</p>
                  <p className="text-2xl font-bold">
                    ₹{card.annualFee.toLocaleString()}
                  </p>
                </div>
                <div className="bg-card rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">Joining Fee</p>
                  <p className="text-2xl font-bold">
                    ₹{card.joiningFee.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button asChild size="lg" className="flex-1">
                  <a
                    href={card.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now
                  </a>
                </Button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="flex justify-center"
            >
              <img
                src={card.image}
                alt={card.name}
                className="h-auto w-80 rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Detailed Information Tabs */}
        <section className="mb-12">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="fineprint">Fine Print</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-4 flex items-center text-lg font-semibold">
                    <Gift className="text-primary mr-2 h-5 w-5" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {card.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-primary mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                {card.welcomeBonus && (
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                      <Sparkles className="text-primary mr-2 h-5 w-5" />
                      Welcome Bonus
                    </h3>
                    <p className="mb-4">{card.welcomeBonus.description}</p>
                    <ul className="space-y-2 text-sm">
                      {card.welcomeBonus.bonusPoints && (
                        <li>
                          <strong>Bonus Points:</strong>{" "}
                          {card.welcomeBonus.bonusPoints.toLocaleString()}
                        </li>
                      )}
                      {card.welcomeBonus.cashback && (
                        <li>
                          <strong>Cashback:</strong> ₹
                          {card.welcomeBonus.cashback.toLocaleString()}
                        </li>
                      )}
                      <li>
                        <strong>Min. Spend:</strong> ₹
                        {card.welcomeBonus.minSpend.toLocaleString()} within{" "}
                        {card.welcomeBonus.timeframeDays} days
                      </li>
                      {card.welcomeBonus.vouchers.length > 0 && (
                        <li>
                          <strong>Vouchers:</strong>{" "}
                          {card.welcomeBonus.vouchers
                            .map((v) => `${v.brand} (₹${v.value})`)
                            .join(", ")}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="fees" className="mt-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="mb-4 flex items-center text-lg font-semibold">
                  <CreditCard className="text-primary mr-2 h-5 w-5" />
                  Fees & Charges
                </h3>
                <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                  <p>
                    <strong>Annual Fee:</strong> ₹
                    {card.annualFee.toLocaleString()}
                  </p>
                  <p>
                    <strong>Joining Fee:</strong> ₹
                    {card.joiningFee.toLocaleString()}
                  </p>
                  <p>
                    <strong>Late Payment:</strong> {card.fees.latePayment}
                  </p>
                  <p>
                    <strong>Over Limit:</strong> {card.fees.overLimit}
                  </p>
                  <p>
                    <strong>Foreign Transaction:</strong>{" "}
                    {card.fees.foreignTransactionPercentage}%
                  </p>
                  <p>
                    <strong>Purchase APR:</strong> {card.fees.aprPurchase}%
                  </p>
                  <p>
                    <strong>Cash Advance APR:</strong>{" "}
                    {card.fees.aprCashAdvance}%
                  </p>
                  <p>
                    <strong>Interest-Free Period:</strong>{" "}
                    {card.fees.interestFreePeriodDays} days
                  </p>
                </div>
                {card.feeWaiver && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="mb-2 font-semibold">Fee Waiver</h4>
                    <p className="text-muted-foreground text-sm">
                      {card.feeWaiver.annualFeeDescription}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="mt-6">
              <div className="space-y-6">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Reward Structure
                  </h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <h4 className="mb-2 font-medium">Base Rate</h4>
                      <p className="text-primary text-lg font-semibold">
                        {card.rewards.baseRatePointsPer100INR} points per ₹100
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Point Value (Est.)</h4>
                      <p className="text-lg">
                        ₹{card.rewards.estimatedPointValueINR}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Point Expiry</h4>
                      <p className="text-lg">{card.rewards.pointExpiry}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Bonus Categories
                    </h3>
                    <div className="space-y-3">
                      {card.rewards.bonusCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between border-b py-2"
                        >
                          <span>{category.category}</span>
                          <Badge variant="secondary">
                            {category.pointsPer100INR}x Points
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Milestone Benefits
                    </h3>
                    <ul className="space-y-2">
                      {card.rewards.milestones.map((milestone) => (
                        <li key={milestone.id} className="flex items-start">
                          <span className="bg-primary mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full"></span>
                          {milestone.reward} on spending ₹
                          {milestone.spendThreshold.toLocaleString()} (
                          {milestone.period})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-4 flex items-center text-lg font-semibold">
                    <Plane className="text-primary mr-2 h-5 w-5" />
                    Travel Benefits
                  </h3>
                  <div className="space-y-3">
                    <p>
                      <strong>Domestic Lounge:</strong>{" "}
                      {card.travelBenefits.loungeAccessDomestic} visits/year
                    </p>
                    <p>
                      <strong>International Lounge:</strong>{" "}
                      {card.travelBenefits.loungeAccessInternational}{" "}
                      visits/year
                    </p>
                    <p>
                      <strong>Lounge Network:</strong>{" "}
                      {card.travelBenefits.loungeAccessNetwork.join(", ")}
                    </p>
                    <p>
                      <strong>Forex Markup:</strong>{" "}
                      {card.travelBenefits.forexMarkup}%
                    </p>
                    <p>
                      <strong>Travel Insurance:</strong>{" "}
                      {card.travelBenefits.travelInsuranceHasInsurance
                        ? `Up to ₹${card.travelBenefits.travelInsuranceCoverageAmount.toLocaleString()}`
                        : "Not Available"}
                    </p>
                  </div>
                </div>
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-4 flex items-center text-lg font-semibold">
                    <Sparkles className="text-primary mr-2 h-5 w-5" />
                    Lifestyle Benefits
                  </h3>
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <Utensils className="mr-2 h-4 w-4" />{" "}
                      <strong>Dining:</strong>{" "}
                      {card.lifestyleBenefits.diningDescription}
                    </p>
                    <p className="flex items-center">
                      <Film className="mr-2 h-4 w-4" /> <strong>Movies:</strong>{" "}
                      {card.lifestyleBenefits.moviesDescription}
                    </p>
                    <p className="flex items-center">
                      <strong>Golf:</strong>{" "}
                      {card.lifestyleBenefits.golfDescription}
                    </p>
                    <p className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />{" "}
                      <strong>Concierge:</strong>{" "}
                      {card.lifestyleBenefits.conciergeDescription}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="eligibility" className="mt-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Eligibility Criteria
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <p>
                      <strong>Min. Income:</strong> ₹
                      {card.eligibilityCriteria.minIncome.toLocaleString()}/year
                    </p>
                    <p>
                      <strong>Age Range:</strong>{" "}
                      {card.eligibilityCriteria.minAge} -{" "}
                      {card.eligibilityCriteria.maxAge} years
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p>
                      <strong>Min. Credit Score:</strong>{" "}
                      {card.eligibilityCriteria.minCreditScore}+
                    </p>
                    <div>
                      <span className="font-medium">Employment Types:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {card.eligibilityCriteria.employmentTypes.map(
                          (type) => (
                            <Badge key={type} variant="outline">
                              {type}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fineprint" className="mt-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="mb-4 flex items-center text-lg font-semibold">
                  <FileText className="text-primary mr-2 h-5 w-5" />
                  The Fine Print
                </h3>
                <div className="grid gap-6 text-sm md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-semibold">Capping & Limits</h4>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1">
                      {card.finePrint.capping.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Exclusions</h4>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1">
                      {card.finePrint.exclusions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Related Cards */}
        {relatedCards.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
              <Link href="/compare">
                <Button variant="outline">
                  View All Cards <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCards.map((relatedCard, index) => (
                <motion.div
                  key={relatedCard.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  {/* CreditCardPreview might need a small update if its props were strict */}
                  <CreditCardPreview card={relatedCard as any} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
