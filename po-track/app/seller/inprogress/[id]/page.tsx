'use client';
import BidderCard from "@/components/Card/BidCard";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import OrderTable from "@/components/Table/OrdersTable";
import {useParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import { bidsRoutes} from "@/core/api/apiRoutes";
import {getData} from "@/core/api/apiHandler";
import BidCardSkeleton from "@/components/Card/BidLoadingCard";

export default function ViewInProgress() {
    const { id } = useParams();

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
            <OrderTable columnHeaders={columnHeaders} rows={getBidDetails?.data.data.orders}  showButton={true}/>
        </div>
    );
}
