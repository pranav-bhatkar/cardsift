"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams } from "next/navigation";
import { LoadingSequence } from "@cc/components/compare/loading-sequence";
import { CardSummarySection } from "@cc/components/compare/card-summary-section";
import { EnhancedComparisonTable } from "@cc/components/compare/enhanced-comparison-table";
import { ChatModal } from "@cc/components/compare/chat-modal";

import { getCreditCardsByCompareId } from "./actions";
import { CreditCardWithAllRelations } from "@cc/lib/prisma";
import { toast } from "sonner";

export default function ComparisonPage() {
  const params = useParams();
  const [selectedCards, setSelectedCards] = useState<
    CreditCardWithAllRelations[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Parse card IDs from URL parameter
    async function fetchCards() {
      const id = params.id as string;
      const cards = await getCreditCardsByCompareId(id);
      setSelectedCards(cards);
    }
    fetchCards();

    // Simulate loading sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [params.id]);

  if (isLoading) {
    return <LoadingSequence />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background min-h-screen"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="mb-2 text-3xl font-bold">Card Comparison</h1>
            <p className="text-muted-foreground">
              Comparing {selectedCards.length} credit cards
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // setIsChatOpen(true)
              toast.error("Chat feature is not implemented yet.");
            }}
            className="bg-primary text-primary-foreground rounded-lg px-6 py-3 font-medium shadow-lg transition-shadow hover:shadow-xl"
          >
            Chat with AI
          </motion.button>
        </motion.div>

        <CardSummarySection cards={selectedCards} />
        <EnhancedComparisonTable cards={selectedCards} />

        <AnimatePresence>
          {isChatOpen && (
            <ChatModal
              cards={selectedCards}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
