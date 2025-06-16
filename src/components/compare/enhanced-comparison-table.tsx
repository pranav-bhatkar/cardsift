"use client";

import React from "react";

import { motion } from "motion/react";
import { DollarSign, Gift, Plane, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@cc/components/ui/button";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";
import { toast } from "sonner";

// Define the type based on your Prisma schema

interface EnhancedComparisonTableProps {
  cards: CreditCardWithAllRelations[];
}

type FormatFunction = (value: any) => string;

const comparisonSections = [
  {
    title: "Fees",
    icon: DollarSign,
    rows: [
      {
        label: "Annual Fee",
        key: "annualFee",
        format: (value: number) => `₹${value.toLocaleString()}` as string,
      },
      {
        label: "Joining Fee",
        key: "joiningFee",
        format: (value: number) => `₹${value.toLocaleString()}` as string,
      },
      {
        label: "Late Payment",
        key: "fees.latePayment",
        format: (value: string) => value as string,
      },
      {
        label: "Over Limit",
        key: "fees.overLimit",
        format: (value: string) => value as string,
      },
      {
        label: "Foreign Transaction",
        key: "fees.foreignTransactionPercentage",
        format: (value: number) => `${value}%` as string,
      },
      {
        label: "APR (Purchase)",
        key: "fees.aprPurchase",
        format: (value: number) => `${value}%` as string,
      },
      {
        label: "APR (Cash Advance)",
        key: "fees.aprCashAdvance",
        format: (value: number) => `${value}%` as string,
      },
      {
        label: "Interest Free Days",
        key: "fees.interestFreePeriodDays",
        format: (value: number) => `${value} days` as string,
      },
    ],
  },
  {
    title: "Rewards",
    icon: Gift,
    rows: [
      {
        label: "Point Value",
        key: "rewards.estimatedPointValueINR",
        format: (value: number) => `₹${value}/point`,
      },
      {
        label: "Base Rate (Points)",
        key: "rewards.baseRatePointsPer100INR",
        format: (value: number | null) => (value ? `${value} pts/₹100` : "N/A"),
      },
      {
        label: "Base Rate (Cashback)",
        key: "rewards.baseRateCashbackPercentage",
        format: (value: number | null) => (value ? `${value}%` : "N/A"),
      },
      {
        label: "Point Expiry",
        key: "rewards.pointExpiry",
        format: (value: string) => value,
      },
    ],
  },
  {
    title: "Travel Benefits",
    icon: Plane,
    rows: [
      {
        label: "Domestic Lounge",
        key: "travelBenefits.loungeAccessDomestic",
        format: (value: number) => `${value} visits/year`,
      },
      {
        label: "International Lounge",
        key: "travelBenefits.loungeAccessInternational",
        format: (value: number) => `${value} visits/year`,
      },
      {
        label: "Travel Insurance",
        key: "travelBenefits.travelInsuranceHasInsurance",
        format: (value: boolean) => (value ? "✓" : "✗"),
      },
      {
        label: "Insurance Coverage",
        key: "travelBenefits.travelInsuranceCoverageAmount",
        format: (value: number) => `₹${value.toLocaleString()}`,
      },
      {
        label: "Forex Markup",
        key: "travelBenefits.forexMarkup",
        format: (value: number) => `${value}%`,
      },
    ],
  },
];

export function EnhancedComparisonTable({
  cards,
}: EnhancedComparisonTableProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Fees",
    "Rewards",
  ]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((s) => s !== sectionTitle)
        : [...prev, sectionTitle],
    );
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const getComparisonColor = (
    sectionTitle: string,
    value: any,
    allValues: any[],
  ) => {
    if (sectionTitle === "Fees") {
      // For fees, lower is better (green)
      const numValue = typeof value === "number" ? value : 0;
      if (numValue === 0) return "";

      const validValues = allValues.filter(
        (v) => typeof v === "number" && v > 0,
      );
      if (validValues.length === 0) return "";

      const minValue = Math.min(...validValues);
      const maxValue = Math.max(...validValues);

      if (numValue === minValue) return "text-green-600 ";
      if (numValue === maxValue) return "text-red-600 ";
      return "text-yellow-600 ";
    }

    if (sectionTitle === "Rewards" || sectionTitle === "Travel Benefits") {
      // For benefits, higher/more is better
      if (typeof value === "number") {
        const validValues = allValues.filter(
          (v) => typeof v === "number" && v > 0,
        );
        if (validValues.length === 0) return "";

        const maxValue = Math.max(...validValues);
        if (value === maxValue && value > 0) return "text-green-600 ";
      }
      if (typeof value === "boolean" && value) return "text-green-600 ";
      if (typeof value === "string" && value !== "N/A" && value !== "0")
        return "text-green-600 ";
    }

    return "";
  };

  return (
    <section className="mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 text-2xl font-bold"
      >
        Detailed Comparison
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card overflow-hidden rounded-lg border"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Sticky Header */}
            <thead className="bg-card sticky top-0 z-10">
              <tr className="bg-muted/50 border-b">
                <th className="min-w-[200px] p-4 text-left font-medium">
                  Features
                </th>
                {cards.map((card, index) => (
                  <motion.th
                    key={card.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="min-w-[200px] p-4 text-center font-medium"
                  >
                    <div className="space-y-2">
                      <div className="h-8 w-12 flex-shrink-0 overflow-hidden rounded border">
                        {card.image && (
                          <img
                            src={card.image}
                            alt={card.name}
                            className="h-full w-full object-contain"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{card.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {card.bank.name}
                        </p>
                      </div>
                    </div>
                  </motion.th>
                ))}
              </tr>
            </thead>

            <tbody>
              {comparisonSections.map((section, sectionIndex) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(section.title);

                return (
                  <React.Fragment key={section.title}>
                    {/* Section Header */}
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + sectionIndex * 0.1 }}
                      className="bg-muted/30 hover:bg-muted/50 cursor-pointer border-b"
                      onClick={() => toggleSection(section.title)}
                    >
                      <td className="p-4" colSpan={cards.length + 1}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Icon className="text-primary mr-3 h-5 w-5" />
                            <span className="text-lg font-semibold">
                              {section.title}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </td>
                    </motion.tr>

                    {/* Section Rows */}
                    {isExpanded &&
                      section.rows.map(
                        (
                          row: {
                            label: string;
                            key: string;
                            format: FormatFunction;
                          },
                          rowIndex,
                        ) => {
                          const allValues = cards.map((card) =>
                            getNestedValue(card, row.key),
                          );

                          return (
                            <motion.tr
                              key={`${section.title}-${row.key}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ delay: rowIndex * 0.05 }}
                              className="hover:bg-muted/20 border-b transition-colors"
                            >
                              <td className="p-4">
                                <span className="font-medium">{row.label}</span>
                              </td>
                              {cards.map((card, cardIndex) => {
                                const value = getNestedValue(card, row.key);
                                let formattedValue;
                                try {
                                  formattedValue =
                                    value !== null && value !== undefined
                                      ? row.format(value)
                                      : "N/A";
                                } catch (error) {
                                  formattedValue = "N/A";
                                }
                                const colorClass = getComparisonColor(
                                  section.title,
                                  value,
                                  allValues,
                                );

                                return (
                                  <motion.td
                                    key={`${card.id}-${row.key}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      delay:
                                        0.9 +
                                        rowIndex * 0.05 +
                                        cardIndex * 0.02,
                                    }}
                                    className={`p-4 text-center ${colorClass} mx-1 rounded-lg`}
                                  >
                                    {formattedValue}
                                  </motion.td>
                                );
                              })}
                            </motion.tr>
                          );
                        },
                      )}
                  </React.Fragment>
                );
              })}

              {/* Benefits Row */}
              <motion.tr
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-muted/10 border-b"
              >
                <td className="p-4">
                  <div className="flex items-center">
                    <Gift className="text-muted-foreground mr-2 h-4 w-4" />
                    <span className="font-medium">Key Benefits</span>
                  </div>
                </td>
                {cards.map((card, cardIndex) => (
                  <motion.td
                    key={`${card.id}-benefits`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + cardIndex * 0.1 }}
                    className="p-4"
                  >
                    <ul className="space-y-1 text-left text-sm">
                      {card.benefits.slice(0, 3).map((benefit, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 1.4 + cardIndex * 0.1 + index * 0.1,
                          }}
                          className="flex items-start"
                        >
                          <span className="bg-primary mt-2 mr-2 h-1 w-1 flex-shrink-0 rounded-full"></span>
                          {benefit}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.td>
                ))}
              </motion.tr>
            </tbody>
          </table>
        </div>

        {/* Export Options */}
        <div className="bg-muted/30 border-t p-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Comparing {cards.length} credit cards across{" "}
              {comparisonSections.length} categories
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Handle export logic here
                toast.message("Export functionality is not implemented yet.", {
                  description: "This feature is coming soon!",
                  duration: 3000,
                });
              }}
            >
              Export as PDF
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
