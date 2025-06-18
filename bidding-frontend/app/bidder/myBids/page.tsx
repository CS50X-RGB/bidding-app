'use client';

import BidderBidCard from "@/components/Card/BidderBidCard";
import SellerBidCard from "@/components/Card/SellerBidCard";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes, analyticsRoutes } from "@/core/api/apiRoutes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function MyBids() {

  const { data: getAllAnalytics, isLoading } = useQuery({
    queryKey: ["get-analytics"],
    queryFn: async () => {
      return await getData(analyticsRoutes.getBidderAnalytics, {});
    },
  });

  const queryClient = useQueryClient();
  const result = queryClient.getQueryData(["getProfile"]);

  const userData=result?.data?.data??null

  console.log("user: ", userData);


  // ✅ Extract orders safely
  const orders = getAllAnalytics?.data.data.totalOrdersInfo?.orders ?? [];

  // ✅ Extract unique bids from orders
  const uniqueBidsMap = new Map();
  orders.forEach((order: any) => {
    if (order.bid && !uniqueBidsMap.has(order.bid._id)) {
      uniqueBidsMap.set(order.bid._id, order.bid);
    }
  });

  const uniqueBids = Array.from(uniqueBidsMap.values());

  console.log("uniqueBids:", uniqueBids);



  return (
    <div className="p-2">
      <div className="flex flex-row justify-end gap-4 p-2">
        <p>👑=You won the Bid</p>
        <p>😞=You loose the bid</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uniqueBids.length > 0 ? (
          uniqueBids.map((bid: any) => (
            <BidderBidCard key={bid._id} bid={bid} orders={orders} user={userData} />
          ))
        ) : (
          <p>No bids found for this bidder.</p>
        )}
      </div>
    </div>
  );
}
