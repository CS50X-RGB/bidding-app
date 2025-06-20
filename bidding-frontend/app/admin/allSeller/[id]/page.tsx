"use client";

import SellerBidCard from "@/components/Card/SellerBidCard";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes, bidsRoutes } from "@/core/api/apiRoutes";
import { Card, User } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

export default function getSellerBids() {
    const params = useParams();
    const id = params?.id

    // Fetch all bids for the specified seller ID.  
    const { data: bidsData, isFetching } = useQuery({
        queryKey: ["all-bids", id],
        queryFn: async () => {
            if (typeof id !== "string") throw new Error("Invalid seller ID");
            return await getData(bidsRoutes.getSellerBids(id), {});
        },

        enabled: typeof id === "string",
    })

    // Fetch user details for the specified seller ID.
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


    const bids = bidsData?.data?.data ?? [];
    const user = userData?.data?.data ?? null;


    if (isFetching || isLoading) return <div>Loading bids...</div>;



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

                    {user?.role?.name && <p>{user.role.name}</p>}
                </div>

            </Card>


            <div className=" grid grid-cols-4 gap-4 ">
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
        </div>
    )
}