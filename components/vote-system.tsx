"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface VoteSystemProps {
  itemId: number;
  initialVotes: { up: number; down: number };
  itemType: "mod" | "comment" | "post";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VoteSystem({
  itemId,
  initialVotes,
  itemType,
  className,
  size = "md",
}: VoteSystemProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = (type: "up" | "down") => {
    setIsLoading(true);
    setTimeout(() => {
      setVotes((prev) => {
        const newVotes = { ...prev };
        if (userVote === "up") newVotes.up--;
        if (userVote === "down") newVotes.down--;
        if (userVote !== type) {
          if (type === "up") newVotes.up++;
          if (type === "down") newVotes.down++;
          setUserVote(type);
        } else {
          setUserVote(null);
        }
        return newVotes;
      });
      setIsLoading(false);
    }, 700);
  };

  const totalScore = votes.up - votes.down;
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {isLoading ? (
        <Skeleton className={cn(sizeClasses[size], "mb-1")} />
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              sizeClasses[size],
              userVote === "up" &&
                "text-green-600 bg-green-50 hover:bg-green-100"
            )}
            onClick={() => handleVote("up")}
            disabled={isLoading}
          >
            <ArrowUp
              className={cn(
                size === "sm" && "h-3 w-3",
                size === "md" && "h-4 w-4",
                size === "lg" && "h-5 w-5"
              )}
            />
          </Button>
          <span
            className={cn(
              "font-medium",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-base",
              totalScore > 0 && "text-green-600",
              totalScore < 0 && "text-red-600"
            )}
          >
            {totalScore > 0 ? `+${totalScore}` : totalScore}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              sizeClasses[size],
              userVote === "down" && "text-red-600 bg-red-50 hover:bg-red-100"
            )}
            onClick={() => handleVote("down")}
            disabled={isLoading}
          >
            <ArrowDown
              className={cn(
                size === "sm" && "h-3 w-3",
                size === "md" && "h-4 w-4",
                size === "lg" && "h-5 w-5"
              )}
            />
          </Button>
        </>
      )}
    </div>
  );
}
