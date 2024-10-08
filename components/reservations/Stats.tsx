import { fetchReservationsStats } from "@/utils/actions";
import StatsCard from "../admin/StatsCard";
import { formatCurrency } from "@/utils/format";

const Stats = async () => {
  const { properties, nights, amount } = await fetchReservationsStats();

  return (
    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard title="Properties" value={properties} />
      <StatsCard title="Nights" value={nights} />
      <StatsCard title="Amount" value={formatCurrency(amount)} />
    </div>
  );
};
export default Stats;
