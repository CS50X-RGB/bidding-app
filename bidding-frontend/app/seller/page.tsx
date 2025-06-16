'use client'
import { getData } from "@/core/api/apiHandler";
import { useQuery } from "@tanstack/react-query";
import { analyticsRoutes } from "@/core/api/apiRoutes";
import BidStatusPieChart from "@/components/charts/BidStatusPieChart";
import { Card } from "@heroui/react";
import { CountCard } from "@/components/Card/CountCard";

export default function SellerPage() {

    const { data: getAllAnalytics, isLoading } = useQuery({
        queryKey: ["get-analytics"],
        queryFn: async () => {
            return await getData(analyticsRoutes.getSellerAnalytics, {})
        }
    })

    console.log(getAllAnalytics);

    return (
        <div className="flex flex-col sm:flex-row justify-center p-4 space-x-8">

            <div className=" w-full flex flex-col sm:flex-row  flex-wrap justify-center gap-4 ">
                <CountCard
                    title="Total Bids"
                    count={getAllAnalytics?.data.data.totalBids || 0}
                />

                {/* Currency-formatted values */}
                <CountCard
                    title="Total Bid Values"
                    count={new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                    }).format(getAllAnalytics?.data.data.totalBidsValue || 0)}
                />

                <CountCard
                    title="Total Bids Accepted Value"
                    count={new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                    }).format(getAllAnalytics?.data.data.totalBidsAcceptedValue || 0)}
                />

                <CountCard
                    title="Total Bids Inprogress Value"
                    count={new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                    }).format(getAllAnalytics?.data.data.totalBidsInProgressValue || 0)}
                />
                <CountCard
                    title="Total Bids Rejected Value"
                    count={new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                    }).format(getAllAnalytics?.data.data.totalBidsRejectedValue || 0)}
                />

                <CountCard
                    title="Total Bids Expired Value"
                    count={new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                    }).format(getAllAnalytics?.data.data.totalBidsExpiredValue || 0)}
                />
                
                
            </div>

            <Card className=" w-full h-max flex flex-col sm:flex-row gap-4  justify-center ">
                {isLoading ? (
                    <p>Loading chart...</p>
                ) : (
                    <BidStatusPieChart data={getAllAnalytics?.data.data.totalBidsCountByStatus || {}} />
                )}
            </Card>
        </div>
    );
}