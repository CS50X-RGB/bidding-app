'use client';

import BidderBidCard from "@/components/Card/BidderBidCard";
import SellerBidCard from "@/components/Card/SellerBidCard";
import { getData } from "@/core/api/apiHandler";
import { analyticsRoutes } from "@/core/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";

export default function MyBids() {

  const { data: getAllAnalytics, isLoading } = useQuery({
    queryKey: ["get-analytics"],
    queryFn: async () => {
      return await getData(analyticsRoutes.getBidderAnalytics, {});
    },
  });

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
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uniqueBids.length > 0 ? (
          uniqueBids.map((bid: any) => (
            <BidderBidCard key={bid._id} bid={bid} orders={orders} />
          ))
        ) : (
          <p>No bids found for this bidder.</p>
        )}
      </div>
    </div>
  );
}
