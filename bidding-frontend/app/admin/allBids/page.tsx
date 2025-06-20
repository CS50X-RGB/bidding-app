'use client';

import SellerBidCard from "@/components/Card/SellerBidCard";
import { getData } from "@/core/api/apiHandler";
import { bidsRoutes } from "@/core/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";

export default function AllBidsAdmin() {

  //fetch all bids
  const { data: allBids, isFetching } = useQuery({
    queryKey: ["get-all-bids"],
    queryFn: async () => {
      return await getData(bidsRoutes.adminBid, {});
    },
  });

  const bids = allBids?.data?.data ?? [];

  console.log(allBids);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bids.length > 0 ? (
          bids.map((bid: any) => (
            <SellerBidCard key={bid._id} bid={bid} />
          ))
        ) : (
          <p>No bids found for this seller.</p>
        )}
      </div>
    </div>
  );
}
