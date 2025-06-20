'use client';
import { CountCard } from "@/components/Card/CountCard";
import CustomTable from "@/components/CustomTable";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes, analyticsRoutes } from "@/core/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BidStatusPieChart from "@/components/charts/BidStatusPieChart";
import { Card } from "@heroui/react";
import Link from "next/link";

export default function Page() {
  const [page, setPage] = useState<number>(1);

  // Fetch all users for the given page with pagination.
  const { data: getAllUsers, isFetching } = useQuery({
    queryKey: ["get-all-users", page],
    queryFn: async () => {
      return await getData(`${accountRoutes.allUsers}/?page=${page}&offset=10`, {});
    }
  });

  // Fetch analytics data.
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

        {/**Dispaly the analytics card */}

        <div className="w-full flex flex-col sm:flex-row  flex-wrap justify-center gap-4 ">
          <CountCard
            title="Total Bids"
            count={getAllAnalytics?.data.data.totalBids || 0}
            href="/admin/view"
          />

          {/* <CountCard
            title="Total Bids"
            count={getAllAnalytics?.data.data.totalBids || 0}
            
          /> */}
          <CountCard
            title="Total Bid Values"
            count={new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(getAllAnalytics?.data.data.totalBidValues || 0)}
          />

          <CountCard
            title="Accepted Bids"
            count={getAllAnalytics?.data.data.totalBidsCountByStatus.accepted}
          />
          <CountCard
            title="Accepted bids value"
            count={new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(getAllAnalytics?.data.data.totalBidsIAcceptedValue || 0)}
          />
          <CountCard
            title="Inprogress Sellers"
            count={getAllAnalytics?.data.data.totalBidsCountByStatus.inprogress}
          />
          <CountCard
            title="Inprogress Bids Value"
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


        {/*  Display a pie chart of bid statuses or a loading message while fetching analytics data. */}

        <Card className=" w-full h-max flex flex-col sm:flex-row gap-4  justify-center ">
          {isFetchingAnalytics ? (
            <p>Loading chart...</p>
          ) : (
            <BidStatusPieChart data={getAllAnalytics?.data.data.totalBidsCountByStatus || {}} />
          )}
        </Card>
      </div>

      {/*Display the  table */}
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
