import React from "react";
import { Button } from "@cc/components/ui/button";
import { Input } from "@cc/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
function HeroSection() {
  return (
    <section className="from-primary/5 via-background to-secondary/5 relative bg-gradient-to-br px-4 py-20">
      <div className="container mx-auto text-center">
        <h1 className="from-primary to-primary/70 mb-6 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
          CardSift
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl md:text-2xl">
          Find Your Perfect Credit Card.
        </p>

        {/* <div className="mx-auto mb-12 max-w-2xl">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about credit cards..."
              className="py-5 text-lg"
            />
            <Button size="lg" className="px-8">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div> */}

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
