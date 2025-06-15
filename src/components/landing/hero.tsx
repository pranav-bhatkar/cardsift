import React from "react";
import { Button } from "@cc/components/ui/button";
import { Input } from "@cc/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          CardSift
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Find Your Perfect Credit Card.
        </p>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about credit cards..."
              className="text-lg py-5"
            />
            <Button size="lg" className="px-8">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <Link href="/chat">
          <Button size="lg" variant="outline" className="mb-8">
            Try AI Chat <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
