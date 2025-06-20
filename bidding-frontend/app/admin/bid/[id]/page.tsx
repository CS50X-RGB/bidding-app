'use client'

import BidderCard from "@/components/Card/BidderCard";
import BidCardSkeleton from "@/components/Card/BidLoadingCard";
import OrderTable from "@/components/Table/OrdersTable";
import { getData } from "@/core/api/apiHandler";
import { bidsRoutes } from "@/core/api/apiRoutes";

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

export default function bidDetilsPage() {
    const params = useParams();
    const id = params?.id

    // Fetch bid details by ID if a valid ID is provided.
    const { data: bidDetails, isFetched, isFetching } = useQuery({
        queryKey: ["get-bid"],
        queryFn: async () => {
            if (typeof id !== "string") throw new Error("Invalid Bid id")

            return await getData(bidsRoutes.getBid(id), {})

        },

        enabled: typeof id === "string"
    })

    if (isFetching) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <BidCardSkeleton key={index} />
                ))}
            </div>
        );
    }
    if (isFetched) {
        console.log(bidDetails?.data.data._doc.orders, "Get Bid Details");
    }
    const columnHeaders = [
        "User Name",
        "Email",
        "Bid Amount",
        "Action"
    ]

    console.log(bidDetails);

    return (
        <div className="flex flex-col gap-4 items-center justify-center p-4">
            <BidderCard bid={bidDetails?.data.data._doc} showButton={false} />
            <OrderTable columnHeaders={columnHeaders} rows={bidDetails?.data.data._doc.orders} showButton={false} />
        </div>
    )
}