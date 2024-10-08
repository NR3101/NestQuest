import { Card, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const StatsLoadingContainer = () => {
  return (
    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  );
};

const LoadingCard = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-full h-20 rounded" />
      </CardHeader>
    </Card>
  );
};

export const ChartLoadingContainer = () => {
  return <Skeleton className="mt-16 w-full h-[300px] rounded" />;
};
