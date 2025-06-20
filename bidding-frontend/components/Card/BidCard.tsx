
import { Card, CardBody, Image, Chip } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BidCard({ bid }: any) {
    console.log(bid, "Bid");

    // Define allowed color types for status indicators.
    type colors = "primary" | "warning" | "success" | "danger" | "default" | "secondary"


    // Return a color based on the bid status.
    const getStatusColor = (status: any): colors => {
        switch (status) {
            case "inprogress":
                return "secondary";
            case "pending":
                return "warning";
            case "accepted":
                return "success";
            default:
                return "default";
        }
    }

    // Find the order with the highest bid amount.
    const highestOrder = bid.orders?.reduce((prev: any, current: any) => {
        return (prev.bidAmount || 0) > (current.bidAmount || 0) ? prev : current;
    }, {});

    return (
        <Link href={`/seller/${bid._id}`} className="w-2/3">
            <Card className="w-full cursor-pointer hover:shadow-2xl transition-shadow">
                <CardBody className="flex flex-row w-full justify-between p-3">
                    <div className="flex flex-row">
                        {bid.images && bid.images.length > 0 && (
                            <Image src={bid.images[0]} alt="image" className="w-120 h-40 rounded-xl shadow-xl" />
                        )}
                        <div className="flex flex-col gap-4 p-4">
                            <h1 className="font-bold text-xl">{bid.name}</h1>

                            <p>{bid.description}</p>
                            {bid.category.map((c: any, index: number) => (
                                <Chip key={index} color="primary">{c.name}</Chip>
                            ))}
                            <Chip color={getStatusColor(bid.status)}>{bid.status.toUpperCase()}</Chip>
                            {bid.status === "accepted" && highestOrder?.createdBy && (
                                <h1 className="text-yellow-300">Bid winner 👑 <span className="text-white">{highestOrder.createdBy.name}</span></h1>
                            )}
                            {bid.status === "inprogress" && highestOrder?.createdBy && (
                                <h1><span className="text-green-500 ">Highest bidder - </span>{highestOrder.createdBy.name}</h1>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 items-center justify-center">
                        {bid.status === "accepted" && (
                            <>
                                <h1 className="font-bold text-3xl"><span className="text-lg text-gray-300">Final Price  </span> Rs {bid.maxtotalPrice}</h1>
                                <h1 className="text-sm text-gray-400">Base Price Rs {bid.totalPrice}</h1>
                            </>
                        )}
                        {bid.status === "inprogress" && (
                            <>
                                <h1 className="font-bold text-3xl"><span className="text-lg text-gray-300">Current Price  </span> Rs {bid.maxtotalPrice}</h1>
                                <h1 className="text-sm text-gray-400">Base Price Rs {bid.totalPrice}</h1>
                            </>
                        )}

                        {bid.status != "inprogress" && bid.status != "accepted" && (
                            <>
                                <h1 className="font-bold text-3xl"><span className="text-lg text-gray-300">Base Price  </span> Rs {bid.totalPrice}</h1>

                            </>
                        )}

                        <h1 className="text-sm text-gray-300">Incremental Value  Rs {bid.incrementalValue}</h1>

                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}

