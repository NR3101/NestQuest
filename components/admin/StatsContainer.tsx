import { fetchStats } from "@/utils/actions";
import StatsCard from "./StatsCard";

const StatsContainer = async () => {
  const stats = await fetchStats();
  return (
    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Users" value={stats.usersCount || 0} />
      <StatsCard title="Properties" value={stats.propertiesCount || 0} />
      <StatsCard title="Bookings" value={stats.bookingsCount || 0} />
      <StatsCard title="Reviews" value={stats.reviewsCount || 0} />
    </div>
  );
};
export default StatsContainer;
