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
    <footer className="bg-card border-t px-4 py-12">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold">CardSift AI</h3>
            <p className="text-muted-foreground text-sm">
              Your trusted companion for finding the perfect credit card with
              AI-powered insights.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-medium">Product</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
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
            <h4 className="mb-4 font-medium">Company</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
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
            <h4 className="mb-4 font-medium">Support</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
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

        <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; 2025 CardSift AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
