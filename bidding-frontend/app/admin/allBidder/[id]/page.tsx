"use client";

import BidderOrderCard from "@/components/Card/BidderOrderCard";
import SellerBidCard from "@/components/Card/SellerBidCard";
import { getData } from "@/core/api/apiHandler";
import { bidsRoutes } from "@/core/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

export default function GetBidderBids() {
    const params = useParams();
    const id = params?.id;

    const { data: bidsData, isFetching } = useQuery({
        queryKey: ["all-bids", id],
        queryFn: async () => {
            if (typeof id !== "string") throw new Error("Invalid Bidder ID");
            return await getData(bidsRoutes.getBidderBids(id), {});
        },
        enabled: typeof id === "string",
    });

    console.log(bidsData);

    const orders = bidsData?.data?.data ?? [];

    if (isFetching) return <div>Loading bids...</div>;

    return (
        <div className="grid grid-cols-4 gap-4 mx-auto p-4">
            {orders.length > 0 ? (
                orders.map((order: any) => (
                    <BidderOrderCard
                        key={order.bid._id}
                        bid={order.bid}
                        orderAmount={order.bidAmount}
                        createdBy={order.createdBy}
                    />
                ))
            ) : (
                <p>No bids found for this seller.</p>
            )}
        </div>
    );
}
