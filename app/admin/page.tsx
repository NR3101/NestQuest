import ChartsContainer from "@/components/admin/ChartsContainer";
import StatsContainer from "@/components/admin/StatsContainer";
import {
  ChartLoadingContainer,
  StatsLoadingContainer,
} from "@/components/admin/Loading";
import { Suspense } from "react";

const AdminPage = () => {
  return (
    <>
      <Suspense fallback={<StatsLoadingContainer />}>
        <StatsContainer />
      </Suspense>

      <Suspense fallback={<ChartLoadingContainer />}>
        <ChartsContainer />
      </Suspense>
    </>
  );
};
export default AdminPage;
