import { cn } from "@cc/lib/utils";
import React from "react";

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}
    >
      {children}
    </div>
  );
}

export default Container;
