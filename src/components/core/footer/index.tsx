import Link from "next/link";
import React from "react";

function Footer() {
  const footerNavConfig = {
    product: [
      { label: "Compare Cards", href: "/compare" },
      { label: "AI Chat", href: "/chat" },
      { label: "Card Reviews", href: "#" },
    ],
    company: [
      { label: "About CardSift", href: "/about" },
      { label: "Contact", href: "mailto:work@pranavbhatkar.me" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "FAQ", href: "#" },
      // { label: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-card border-t py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">CardFinder AI</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted companion for finding the perfect credit card with
              AI-powered insights.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerNavConfig.product.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerNavConfig.company.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerNavConfig.support.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CardFinder AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
