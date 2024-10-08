"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mt-4">
      <ReviewCardSkeleton />
      <ReviewCardSkeleton />
    </div>
  );
};

const ReviewCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Skeleton className="size-12 rounded-full" />
          <div className="ml-4">
            <Skeleton className="w-[150px] h-4 mb-2" />
            <Skeleton className="w-[100px] h-4" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default Loading;
