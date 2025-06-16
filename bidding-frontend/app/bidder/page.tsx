'use client';
import BidderCard from "@/components/Card/BidderCard";
import BidCardSkeleton from "@/components/Card/BidLoadingCard";
import { CountCard } from "@/components/Card/CountCard";
import BidStatusPieChart from "@/components/charts/BidStatusPieChart";
import WinPercentageGauge from "@/components/charts/WinPercentageGauge";
import { getData } from "@/core/api/apiHandler"
import { analyticsRoutes, bidsRoutes } from "@/core/api/apiRoutes"
import { Card } from "@heroui/react";
import { useQuery } from "@tanstack/react-query"
import { all } from "axios";

export default function ViewAllBids() {
    const { data: getAllAnalytics, isLoading } = useQuery({
        queryKey: ["get-analytics"],
        queryFn: async () => {
            return await getData(analyticsRoutes.getBidderAnalytics, {})
        }
    })

    console.log(getAllAnalytics);

    return (
        <div className="flex flex-col sm:flex-row justify-center p-4 space-x-8">

            <div className=" w-full flex flex-col sm:flex-row  flex-wrap justify-center gap-4 ">
                <CountCard
                    title="Total Participated Bids"
                    count={getAllAnalytics?.data.data.totalBidsParticipated || 0}
                />
                <CountCard
                    title="Total Order Placed"
                    count={getAllAnalytics?.data.data.totalOrdersPlaced || 0}
                />
                <CountCard
                    title="Total Order Pending"
                    count={getAllAnalytics?.data.data.totalOrdersPending || 0}
                />
                <CountCard
                    title="Total Order Accepted"
                    count={getAllAnalytics?.data.data.totalOrdersAccepted || 0}
                />

                {/* Currency-formatted values */}
                <CountCard
                    title="Total amount placed"
                    count={new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                    }).format(getAllAnalytics?.data.data.totalAmountPlaced || 0)}
                />

                <CountCard
                    title="Total Amout Spent"
                    count={new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                    }).format(getAllAnalytics?.data.data.totalAmountAccepted || 0)}
                />




            </div>

            <Card className=" w-2/3 h-max flex flex-col sm:flex-row gap-4  justify-center ">
                {isLoading ? (
                    <p>Loading chart...</p>
                ) : (
                    <div className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2">Win Percentage</h3>
                        <WinPercentageGauge percentage={getAllAnalytics?.data.data.winningRate || 0} />
                    </div>
                )}
            </Card>
        </div>
    )
}