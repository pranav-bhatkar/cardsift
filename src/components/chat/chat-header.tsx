"use client";

import { usePathname, useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { Button } from "@cc/components/ui/button";
import { PlusIcon } from "./icons";

import { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cc/components/ui/tooltip";

function PureChatHeader() {
  const router = useRouter();

  const { width: windowWidth } = useWindowSize();
  const pathname = usePathname();
  return (
    <header className="bg-background sticky top-0 container mx-auto flex items-center gap-2 px-2 py-1.5 md:px-2">
      {pathname !== "/chat" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 mr-auto px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
              onClick={() => {
                router.push("/chat");
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
