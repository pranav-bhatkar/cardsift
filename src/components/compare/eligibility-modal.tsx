"use client";

import type React from "react";

import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CheckCircle,
  XCircle,
  TrendingUp,
  Briefcase,
  CreditCard,
  Calendar,
} from "lucide-react";
import { Button } from "@cc/components/ui/button";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";
import { authClient } from "@cc/lib/auth-client";
import { User } from "@cc/generated/prisma";

interface EligibilityModalProps {
  card: CreditCardWithAllRelations;
  eligibilityScore: number;
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

interface CriteriaCheck {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  passed: boolean;
  userValue: string;
  requirement: string;
  suggestion?: string;
}

export function EligibilityModal({
  card,
  eligibilityScore,
  isOpen,
  user,
  onClose,
}: EligibilityModalProps) {
  const criteriaChecks: CriteriaCheck[] = [
    {
      name: "Income",
      icon: TrendingUp,
      passed: user.income >= card.eligibilityCriteria.minIncome,
      userValue: `₹${user.income.toLocaleString()}/year`,
      requirement: `₹${card.eligibilityCriteria.minIncome.toLocaleString()}/year minimum`,
      suggestion:
        user.income < card.eligibilityCriteria.minIncome
          ? "Consider applying after a salary increase or include additional income sources"
          : undefined,
    },
    {
      name: "Age",
      icon: Calendar,
      passed:
        user.age >= card.eligibilityCriteria.minAge &&
        user.age <= card.eligibilityCriteria.maxAge,
      userValue: `${user.age} years`,
      requirement: `${card.eligibilityCriteria.minAge}-${card.eligibilityCriteria.maxAge} years`,
    },
    {
      name: "Employment",
      icon: Briefcase,
      passed: card.eligibilityCriteria.employmentTypes.includes(
        user.employment,
      ),
      userValue: user.employment,
      requirement: card.eligibilityCriteria.employmentTypes.join(", "),
    },
    {
      name: "Credit Score",
      icon: CreditCard,
      passed: user.creditScore >= card.eligibilityCriteria.minCreditScore,
      userValue: user.creditScore.toString(),
      requirement: `${card.eligibilityCriteria.minCreditScore}+ required`,
      suggestion:
        user.creditScore < card.eligibilityCriteria.minCreditScore
          ? "Improve credit score by paying bills on time and reducing credit utilization"
          : undefined,
    },
  ];

  const passedCriteria = criteriaChecks.filter((c) => c.passed).length;
  const isEligible = passedCriteria === criteriaChecks.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-xl font-bold">Eligibility Analysis</h2>
                <p className="text-muted-foreground">{card.name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Overall Score */}
            <div className="border-b p-6">
              <div className="mb-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold ${
                    isEligible
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {eligibilityScore}%
                </motion.div>
                <h3 className="mt-2 text-lg font-semibold">
                  {isEligible ? "You're Eligible!" : "Not Eligible Yet"}
                </h3>
                <p className="text-muted-foreground">
                  {passedCriteria} of {criteriaChecks.length} criteria met
                </p>
              </div>

              <div className="bg-muted h-2 w-full rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(passedCriteria / criteriaChecks.length) * 100}%`,
                  }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className={`h-2 rounded-full ${isEligible ? "bg-green-500" : "bg-red-500"}`}
                />
              </div>
            </div>

            {/* Criteria Breakdown */}
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Criteria Breakdown</h3>
              <div className="space-y-4">
                {criteriaChecks.map((criteria, index) => {
                  const Icon = criteria.icon;
                  return (
                    <motion.div
                      key={criteria.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`rounded-lg border p-4 ${
                        criteria.passed
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`rounded-full p-2 ${criteria.passed ? "bg-green-100" : "bg-red-100"}`}
                          >
                            <Icon
                              className={`h-4 w-4 ${criteria.passed ? "text-green-600" : "text-red-600"}`}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{criteria.name}</h4>
                            <p className="text-muted-foreground text-sm">
                              Your value: {criteria.userValue}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Required: {criteria.requirement}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {criteria.passed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </div>
                      {criteria.suggestion && (
                        <div className="mt-3 rounded border border-yellow-200 bg-yellow-50 p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Suggestion:</strong> {criteria.suggestion}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Action Section */}
            <div className="bg-muted/30 border-t p-6">
              {isEligible ? (
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold text-green-700">
                    Ready to Apply!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You meet all eligibility criteria for this card. You can
                    proceed with the application.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Apply Now
                    </Button>
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold text-red-700">
                    Not Eligible Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Work on the criteria above and check back later. Consider
                    exploring other cards that might be a better fit.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button size="lg" variant="outline">
                      View Similar Cards
                    </Button>
                    <Button size="lg" variant="outline">
                      Improve Credit Score
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
