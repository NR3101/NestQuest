import { Card, CardHeader } from "../ui/card";

const StatsCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  return (
    <Card className="bg-muted">
      <CardHeader className="flex flex-row justify-between items-center">
        <h3 className="text-3xl capitalize font-bold">{title}</h3>
        <span className="text-5xl text-primary font-extrabold">{value}</span>
      </CardHeader>
    </Card>
  );
};
export default StatsCard;
