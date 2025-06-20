'use client';
import BidCard from "@/components/Card/BidCard";
import BidCardSkeleton from "@/components/Card/BidLoadingCard";
import { getData } from "@/core/api/apiHandler"
import { bidsRoutes } from "@/core/api/apiRoutes"
import { useQuery } from "@tanstack/react-query"

export default function ViewMyBids() {

    //fetching the users bids 
    const { data: myBids, isFetching } = useQuery({
        queryKey: ["get-my-bids"],
        queryFn: async () => {
            return await getData(bidsRoutes.myBids, {});
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
            <h1 className="text-2xl font-bold">My Bids</h1>
            <div className="flex flex-col items-center gap-4 p-4 justify-around">
                {myBids?.data.data.map((bid: any, index: number) => {
                    return <BidCard key={index} bid={bid} />
                })}
            </div>
        </div>
    )
}