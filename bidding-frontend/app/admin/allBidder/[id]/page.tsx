"use client";

import BidderOrderCard from "@/components/Card/BidderOrderCard";
import SellerBidCard from "@/components/Card/SellerBidCard";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes, bidsRoutes } from "@/core/api/apiRoutes";
import { Card, User } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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

    const { data: userData, isFetching: isLoading } = useQuery({
        queryKey: ["get-user", id],
        queryFn: async () => {
            if (typeof id !== "string") throw new Error("Invalid seller ID");
            return await getData(accountRoutes.getUserById(id), {})
        },
        enabled: typeof id === "string",
    })

    console.log(bidsData);
    console.log(userData);


    const orders = bidsData?.data?.data ?? [];
    const user = userData?.data?.data ?? [];

    if (isFetching) return <div>Loading bids...</div>;

    return (
        <div className="flex flex-col  p-4 space-y-4">
            <Card className="p-2">
                <div className="flex flex-row items-center justify-between">
                    <User className=""
                        avatarProps={{
                            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                        }}
                        description={
                            <Link href="" >
                                {user.email}
                            </Link>
                        }
                        name={user.name}

                    />

                    <p>{user.role.name}</p>
                </div>

            </Card>
            <div className="grid grid-cols-4 gap-4 ">
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
        </div>

    );
}
