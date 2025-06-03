"use client";

import SellerBidCard from "@/components/Card/SellerBidCard";
import { getData } from "@/core/api/apiHandler";
import { bidsRoutes } from "@/core/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

export default function getSellerBids() {
    const params = useParams();
    const id = params?.id

    const { data: bidsData, isFetching } = useQuery({
        queryKey: ["all-bids", id],
        queryFn: async () => {
            if (typeof id !== "string") throw new Error("Invalid seller ID");
            return await getData(bidsRoutes.getSellerBids(id), {});
        },

        enabled: typeof id === "string",
    })

    console.log(bidsData);

    const bids = bidsData?.data?.data ?? [];


    if (isFetching) return <div>Loading bids...</div>;


    return (
        <div className=" grid grid-cols-4 gap-4 mx-auto p-4">
            {bids.length > 0 ? (
                bids.map((bid: any) => (
                    <SellerBidCard
                        key={bid._id} bid={bid}
                    />
                ))
            ) : (
                <p>No bids found for this seller.</p>
            )
            }


        </div>
    )
}