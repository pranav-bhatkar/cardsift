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
      className={cn("mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

export default Container;
