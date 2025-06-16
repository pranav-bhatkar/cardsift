"use client";

import { motion } from "motion/react";
import { Star, Shield, ShieldCheck, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

import { Badge } from "@cc/components/ui/badge";
import { Button } from "@cc/components/ui/button";
import { EligibilityModal } from "@cc/components/compare/eligibility-modal";

import Link from "next/link";
import { authClient } from "@cc/lib/auth-client";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";
import { User } from "@cc/generated/prisma";
import { generateCardSummary, getUserById } from "@cc/app/action";

interface CardSummaryProps {
  cards: CreditCardWithAllRelations[];
}

interface EligibilityStatus {
  cardId: string;
  eligible: boolean;
  score: number;
  reasons: string[];
}

export function CardSummarySection({ cards }: CardSummaryProps) {
  const { data: session, error, isPending } = authClient.useSession();
  const [eligibilityData, setEligibilityData] = useState<EligibilityStatus[]>(
    [],
  );
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [selectedCard, setSelectedCard] =
    useState<CreditCardWithAllRelations | null>(null);
  const [selectedScore, setSelectedScore] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbUser, setDBUser] = useState<User | null>(null);
  const [aiSummarys, setAiSummarys] = useState<
    {
      cardId: string;
      summary: string;
    }[]
  >([]);
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
      checkEligibility();
    }
    if (cards.length > 0) {
      generateAISummary(cards);
    }
  }, [session?.user, cards]);
  const generateAISummary = async (cards: CreditCardWithAllRelations[]) => {
    const summaries = await Promise.all(
      cards.map(async (card) => {
        await generateCardSummary(card.id);
        const summary = await generateCardSummary(card.id);
        return {
          cardId: card.id,
          summary: summary.text || "No summary available",
        };
      }),
    );
    setAiSummarys(summaries);
  };
  const fetchUserProfile = async () => {
    const user = await getUserById(session?.user.id || "");

    if (user) {
      setDBUser(user);
    } else {
      console.error("User not found");
    }
  };
  const checkEligibility = async () => {
    setIsCheckingEligibility(true);

    // Simulate AI eligibility checking
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const eligibilityResults = cards.map((card) => {
      // Calculate actual eligibility based on user profile
      let score = 0;
      let criteriaCount = 0;

      if (dbUser) {
        // Income check
        if (dbUser.income >= card.eligibilityCriteria.minIncome) score += 25;
        criteriaCount++;

        // Age check
        if (
          dbUser.age >= card.eligibilityCriteria.minAge &&
          dbUser.age <= card.eligibilityCriteria.maxAge
        )
          score += 25;
        criteriaCount++;

        // Employment check
        if (
          card.eligibilityCriteria.employmentTypes.includes(dbUser.employment)
        )
          score += 25;
        criteriaCount++;

        // Credit score check
        if (dbUser.creditScore >= card.eligibilityCriteria.minCreditScore)
          score += 25;
        criteriaCount++;
      }

      return {
        cardId: card.id,
        eligible: score === 100,
        score: score,
        reasons: [
          "Income meets minimum requirement",
          "Credit score is excellent",
          "Employment history is stable",
        ],
      };
    });

    setEligibilityData(eligibilityResults);
    setIsCheckingEligibility(false);
  };

  const getEligibilityStatus = (cardId: string) => {
    return eligibilityData.find((data) => data.cardId === cardId);
  };

  const handleEligibilityClick = (
    card: CreditCardWithAllRelations,
    score: number,
  ) => {
    setSelectedCard(card);
    setSelectedScore(score);
    setIsModalOpen(true);
  };

  return (
    <section className="mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-2xl font-bold"
      >
        Card Summary
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const eligibility = getEligibilityStatus(card.id);

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
              className="bg-card cursor-pointer rounded-lg border p-6"
            >
              {/* Card Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold">{card.name}</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    {card.bank.name}
                  </p>
                  <Badge variant="secondary">{card.cardType}</Badge>
                </div>
                <div className="h-10 w-16 flex-shrink-0 overflow-hidden rounded border">
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              </div>

              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.5 }}
                className="mb-4"
              >
                <TypewriterText
                  text={
                    aiSummarys.find((summary) => summary.cardId === card.id)
                      ?.summary || "Loading summary..."
                  }
                />
              </motion.div>

              {/* Rating */}
              <div className="mb-4 flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{card.rating}</span>
                <span className="text-muted-foreground ml-2 text-sm">
                  ({Math.floor(Math.random() * 1000) + 500} reviews)
                </span>
              </div>

              {/* Eligibility Status */}
              <div className="space-y-2">
                {session?.user ? (
                  isCheckingEligibility ? (
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 0 10px rgba(59, 130, 246, 0)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="border-primary/20 rounded-lg border-2 p-3"
                    >
                      <div className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="mr-2"
                        >
                          <Shield className="text-primary h-4 w-4" />
                        </motion.div>
                        <span className="text-sm">Checking eligibility...</span>
                      </div>
                    </motion.div>
                  ) : eligibility ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        ...(eligibility.eligible && {
                          boxShadow: [
                            "0 0 0 0 rgba(34, 197, 94, 0.4)",
                            "0 0 0 8px rgba(34, 197, 94, 0)",
                          ],
                        }),
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        ...(eligibility.eligible && {
                          boxShadow: {
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          },
                        }),
                      }}
                      className={`cursor-pointer rounded-lg border-2 p-3 transition-transform hover:scale-105 ${
                        eligibility.eligible
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                      }`}
                      onClick={() =>
                        handleEligibilityClick(card, eligibility.score)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ShieldCheck
                            className={`mr-2 h-4 w-4 ${eligibility.eligible ? "text-green-600" : "text-red-600"}`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              eligibility.eligible
                                ? "text-green-700 dark:text-green-300"
                                : "text-red-700 dark:text-red-300"
                            }`}
                          >
                            {eligibility.eligible ? "Eligible" : "Not Eligible"}
                          </span>
                        </div>
                        <Badge
                          variant={
                            eligibility.eligible ? "default" : "destructive"
                          }
                        >
                          {eligibility.score}% match
                        </Badge>
                      </div>
                    </motion.div>
                  ) : null
                ) : (
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm" className="w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login to Check Eligibility
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Eligibility Modal */}
      {selectedCard && dbUser && (
        <EligibilityModal
          user={dbUser}
          card={selectedCard}
          eligibilityScore={selectedScore}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }
      },
      delay + 10, // Adjust delay for each character
    );

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <p className="text-muted-foreground text-sm">
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          className="bg-primary ml-1 inline-block h-4 w-0.5"
        />
      )}
    </p>
  );
}
