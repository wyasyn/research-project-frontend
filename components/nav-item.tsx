"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavItem() {
  const router = useRouter();
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Home"
            onClick={() => router.push("/dashboard")}
          >
            <Home size={16} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">Home</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
