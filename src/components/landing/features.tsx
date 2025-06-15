import { BarChart3, Database, Sparkles } from "lucide-react";
import React from "react";

function FeaturesSection() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Why Choose CardSift AI?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-6 text-center transition-shadow hover:shadow-lg">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <Sparkles className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">AI-Powered Search</h3>
            <p className="text-muted-foreground">
              Get personalized credit card recommendations based on your
              spending patterns and preferences using advanced AI.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 text-center transition-shadow hover:shadow-lg">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <BarChart3 className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              Real-time Comparisons
            </h3>
            <p className="text-muted-foreground">
              Compare multiple credit cards side-by-side with up-to-date
              information on fees, benefits, and rewards.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 text-center transition-shadow hover:shadow-lg">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <Database className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">
              Comprehensive Database
            </h3>
            <p className="text-muted-foreground">
              Access detailed information on hundreds of credit cards from all
              major Indian banks and financial institutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
