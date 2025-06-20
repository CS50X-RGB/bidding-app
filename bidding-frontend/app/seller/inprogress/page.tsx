"use client";
import { useQuery } from "@tanstack/react-query";
import { bidsRoutes } from "@/core/api/apiRoutes";
import { getData } from "@/core/api/apiHandler";
import BidCardSkeleton from "@/components/Card/BidLoadingCard";
import BidCard from "@/components/Card/PressableCard";

export default function InrogressPage() {
    //fetching the inprogess  bids
    const { data: getInProgress, isFetching } = useQuery({
        queryKey: ["getInProgress"],
        queryFn: async () => {
            return await getData(bidsRoutes.sellerInprogress, {});
        }
    });
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
                {getInProgress?.data.data.map((bid: any, index: number) => {
                    return <BidCard key={index} bid={bid} />
                })}
            </div>
        </div>
    )
}
