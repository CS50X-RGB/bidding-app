
import { Card, CardBody, Image, Chip } from "@heroui/react";

export default function BidCard({ bid }: any) {
    console.log(bid, "Bid");
    type colors = "primary" | "warning" | "success" | "danger" | "default" | "secondary"
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

    const highestOrder = bid.orders?.reduce((prev: any, current: any) => {
        return (prev.bidAmount || 0) > (current.bidAmount || 0) ? prev : current;
    }, {});
    return (
        <Card className="w-2/3">
            <CardBody className="flex flex-row w-full justify-between p-3">
                <div className="flex flex-row">
                    {bid.images && bid.images.length > 0 && (
                        <Image src={bid.images[0]} alt="image" className="w-120 h-40 rounded-xl shadow-xl" />
                    )}
                    <div className="flex flex-col gap-4 p-4">
                        <h1 className="font-bold text-xl">{bid.name}</h1>
                        <p>{bid.description}</p>
                        {bid.category.map((c: any, index: number) => {
                            return <Chip key={index} color="primary">{c.name}</Chip>
                        })}
                        <Chip color={getStatusColor(bid.status)}>{bid.status.toUpperCase()}</Chip>
                        {bid.status === "accepted" && highestOrder && highestOrder.createdBy && (
                        <h1 className="text-yellow-300">Bid winner 👑 <span className="text-white">{highestOrder.createdBy.name}</span></h1>
                    )}
                    {bid.status === "inprogress" && highestOrder && highestOrder.createdBy && (
                        <h1><span className="text-green-500 ">Highest bidder - </span>{highestOrder.createdBy.name}</h1>
                    )}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="font-bold text-3xl">Rs {bid.maxtotalPrice}</h1>
                    
                </div>
            </CardBody>
        </Card>
    );
}
