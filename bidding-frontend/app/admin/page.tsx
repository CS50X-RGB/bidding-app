'use client';
import { CountCard } from "@/components/Card/CountCard";
import CustomTable from "@/components/CustomTable";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes, analyticsRoutes } from "@/core/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BidStatusPieChart from "@/components/charts/BidStatusPieChart";
import { Card } from "@heroui/react";

export default function Page() {
  const [page, setPage] = useState<number>(1);
  const { data: getAllUsers, isFetching } = useQuery({
    queryKey: ["get-all-users", page],
    queryFn: async () => {
      return await getData(`${accountRoutes.allUsers}/?page=${page}&offset=10`, {});
    }
  });
  const { data: getAllAnalytics, isFetching: isFetchingAnalytics } = useQuery({
    queryKey: ["get-analytics", page],
    queryFn: async () => {
      return await getData(analyticsRoutes.getAnalyticsValue, {});

    }


  });
  console.log(getAllAnalytics);

  return (

    <>
      <div className="flex flex-col sm:flex-row justify-center p-4 space-x-8">

        <div className=" w-full flex flex-col sm:flex-row  flex-wrap justify-center gap-4 ">
          <CountCard
            title="Total Bids"
            count={getAllAnalytics?.data.data.totalBids || 0}
          />

          {/* Currency-formatted values */}
          <CountCard
            title="Total Bid Values"
            count={new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(getAllAnalytics?.data.data.totalBidValues || 0)}
          />

          <CountCard
            title="Total Bids Accepted Value"
            count={new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(getAllAnalytics?.data.data.totalBidsIAcceptedValue || 0)}
          />

          <CountCard
            title="Total Bids Inprogress Value"
            count={new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(getAllAnalytics?.data.data.totalBidsInProgessValue || 0)}
          />
          <CountCard
            title="Total Active Bidders"
            count={getAllAnalytics?.data.data.userData.BIDDER}
          />
          <CountCard
            title="Total Active Sellers"
            count={getAllAnalytics?.data.data.userData.SELLER}
          />
        </div>

        <Card className=" w-full h-max flex flex-col sm:flex-row gap-4  justify-center ">
          {isFetchingAnalytics ? (
            <p>Loading chart...</p>
          ) : (
            <BidStatusPieChart  data={getAllAnalytics?.data.data.totalBidsCountByStatus || {}} />
          )}
        </Card>
      </div>

      <div className=" w-full  p-4 flex justify-center mx-auto">
        <CustomTable
        data={getAllUsers?.data.data.users}
        loadingState={isFetching}
        page={page}
        setPage={setPage}
        pages={3}
      />
      </div>

    </>


  );
}
