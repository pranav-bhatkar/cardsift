import { BarChart3, Database, Sparkles } from "lucide-react";
import React from "react";

function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose CardFinder AI?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Search</h3>
            <p className="text-muted-foreground">
              Get personalized credit card recommendations based on your
              spending patterns and preferences using advanced AI.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Real-time Comparisons
            </h3>
            <p className="text-muted-foreground">
              Compare multiple credit cards side-by-side with up-to-date
              information on fees, benefits, and rewards.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
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
