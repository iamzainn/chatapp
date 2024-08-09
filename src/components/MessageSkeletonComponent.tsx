import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageSkeletonProps {
  count: number;
}

const MessageSkeleton: React.FC<MessageSkeletonProps> = ({ count }) => {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className={cn("flex gap-3 items-center", index % 2 === 0 ? "justify-start" : "justify-end")}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 w-[200px]" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;