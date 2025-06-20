'use client';
import { CheckIcon } from "@/public/Icons/CheckIcon";
import { Card, CardBody, Image, Chip, User, Link } from "@heroui/react";


export default function AcceptedCard({ bid }: any) {
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
    return (
        <Card className="w-2/3">
            <CardBody className="flex flex-row w-full justify-between p-3">
                <div className="flex flex-row">
                    {bid.images && bid.images.length > 0 && (
                        <Image src={bid.images[0]} alt="image" className="w-120 h-60 rounded-xl shadow-xl" />
                    )}
                    <div className="flex flex-col gap-4 p-4">
                        <h1 className="font-bold text-xl">{bid.name}</h1>
                        <p>{bid.description}</p>
                        {bid.category.map((c: any, index: number) => {
                            return <Chip key={index} color="primary">{c.name}</Chip>
                        })}
                        <Chip color={getStatusColor(bid.status)} startContent={bid.status === "accepted" && (
                            <CheckIcon width={6} height={6} size={18} />
                        )}>{bid.status.toUpperCase()}</Chip>
                        <User
                            avatarProps={{
                                src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                            }}
                            description={
                                <div className="flex flex-col gap-2">
                                    <h1>Accepted By</h1>
                                    <Link isExternal href={bid.createdBy.email} size="sm">
                                        {bid.acceptedBy.email}
                                    </Link>
                                </div>
                            }
                            name={bid.acceptedBy.name}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="font-bold text-2xl">Rs {bid.maxtotalPrice}</h1>
                </div>
            </CardBody>
        </Card>
    );
}
