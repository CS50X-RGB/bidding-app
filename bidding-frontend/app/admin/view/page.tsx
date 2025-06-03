'use client';
import AdminBidCard from "@/components/Card/AdminBidCard";
import BidCardSkeleton from "@/components/Card/BidLoadingCard";
import { getData } from "@/core/api/apiHandler"
import { bidsRoutes } from "@/core/api/apiRoutes"
import { useQuery } from "@tanstack/react-query"

export default function ViewAllBidsAdmin() {
    const { data: allBids, isFetching } = useQuery({
        queryKey: ["get-all-bids"],
        queryFn: async () => {
            return await getData(bidsRoutes.adminBid, {});
        }
    });

    console.log(allBids);
    
    if (isFetching) {
        return (
            <div className="flex flex-col gap-4 items-center w-full">
                {Array.from({ length: 3 }).map((_: any, index: number) => {
                    return <BidCardSkeleton key={index} />
                })}
            </div>
        );

    }
    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">All Bids</h1>
            <div className="flex flex-col items-center gap-4 p-4 justify-around">
                {allBids?.data.data.map((bid: any, index: number) => {
                    return <AdminBidCard key={index} bid={bid} />
                })}
            </div>
        </div>
    )
}