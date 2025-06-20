'use client';

import { getData } from "@/core/api/apiHandler";
import { bidsRoutes } from "@/core/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import BidCardSkeleton from "@/components/Card/BidLoadingCard";
import BidderCard from "@/components/Card/BidderCard";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import OrderTable from "@/components/Table/OrdersTable";

export default function ViewOnBid() {
    const { id } = useParams();

    //Feteches all the bid details
    const { data: getBidDetails, isFetched, isFetching } = useQuery({
        queryKey: ["getBidDetails", id],
        queryFn: async () => {
            return await getData(`${bidsRoutes.getBitDetails}${id}`, {});
        },
        enabled: !!id,
    });

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
        console.log(getBidDetails?.data.data.orders, "Get Bid Details");
    }

    //prop to pass in order table
    const columnHeaders = [
        "User Name",
        "Email",
        "Bid Amount",
        "Action"
    ]
    // fallback or main render
    return (
        <div className="flex flex-col gap-4 items-center justify-center p-4">
            <BidderCard bid={getBidDetails?.data.data} />
            <OrderTable columnHeaders={columnHeaders} rows={getBidDetails?.data.data.orders}  showButton={false}/>
        </div>
    );
}
