'use client'
import { Card, CardBody, Image, Chip, Button, User, Link, useDisclosure, Input } from "@heroui/react";
import CustomModal from "../Modal/CustomModal";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/core/api/apiHandler";
import { bidsRoutes } from "@/core/api/apiRoutes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { queryClient } from "@/app/providers";

export default function BidderCard({ bid,showPlaceBid = true  }: any) {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const minBidAmount = bid.maxtotalPrice + (bid.incrementalValue ?? 0);
    const [bidAmount, setBidAmount] = useState<string>(minBidAmount.toString());


    // Create a new order for a bid, navigate to the bid details page, and refresh related queries.
    const createOrder = useMutation({
        mutationKey: ["create-order"],
        mutationFn: async (data: any) => {
            return postData(`${bidsRoutes.createOrder}${bid._id}`, {}, data);
        },
        onSuccess: (data: any) => {
            console.log(data.data.data.bid._id, "Sueccss");
            router.push(`/bidder/${data.data.data.bid._id}`);
            queryClient.invalidateQueries();
        },
        onError: (error: any) => {
            console.log(error);
        }
    });

    // Validate bid amount and create a new order if valid.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        //  e.preventDefault();
        const amount = Number(bidAmount);
        const minBid = bid.maxtotalPrice + (bid.incrementalValue ?? 0);
        if (isNaN(amount) || amount < minBid) {
            toast.error(`Bid must be at least Rs ${minBid}`);
            return;
        }
        createOrder.mutate({
            bidAmount: amount
        });
        onClose();
    }
    return (
        <>
            <Card className="w-2/3">
                <CardBody className="flex flex-row w-full justify-between p-3">
                    <div className="flex flex-row items-center">
                        {bid.images && bid.images.length > 0 && (
                            <Image src={bid.images[0]} alt="image" className="w-[200px] h-[100px] rounded-xl shadow-xl" />
                        )}
                        <div className="flex flex-col gap-4 p-4">
                            <h1 className="font-bold text-xl">{bid.name}</h1>
                            <p>{bid.description}</p>
                            {bid.category.map((c: any, index: number) => (
                                <Chip key={index} color="primary">{c.name}</Chip>
                            ))}
                            <User
                                avatarProps={{
                                    src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                                }}
                                description={
                                    <Link isExternal href={bid.createdBy.email} size="sm">
                                        {bid.createdBy.email}
                                    </Link>
                                }
                                name={bid.createdBy.name}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 justify-center">
                        <h1 className="font-bold text-3xl">Rs {bid.maxtotalPrice}</h1>
                        {localStorage.getItem("ROLE") === "BIDDER" && (
                            <Button color="primary" className="rounded-xl" onPress={() => onOpen()}>
                                Place Bid
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>

            <CustomModal
                heading="Minimum Value to start Bidding"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                bottomContent={
                    <Button onPress={(e) => handleSubmit(e)}>Submit</Button>
                }
            >
                <Input
                    label="Price"
                    labelPlacement="outside"
                    placeholder="0.00"
                    min={minBidAmount}
                    value={bidAmount}
                    onValueChange={setBidAmount}
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">Rs</span>
                        </div>
                    }
                    type="number"
                />
            </CustomModal>
        </>
    );
}
