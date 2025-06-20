import { Card, CardBody, Image, Chip, Button, User, Link, useDisclosure, Input } from "@heroui/react";
import CustomModal from "../Modal/CustomModal";
import { useApproveBid } from "../Bids/useApproveBid";
import { useRejectBid } from "../Bids/useRejectBid";
import { useState } from "react";
import { useDeleteBid } from "../Bids/useDeleteBid";



export default function AdminBidCard({ bid }: any) {
    // Manage modal open/close state.
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    // Custom hook to approve a bid with loading state.
    const { mutate: approveBid, isPending: isApproving } = useApproveBid()

    // Custom hook to reject a bid with loading state.
    const { mutate: rejectBid, isPending: isRejeting } = useRejectBid();

    // Custom hook to delete a bid with loading state.
    const { mutate: deleteBid, isPending: isDeleting } = useDeleteBid();

    // Handle deleting a bid and close the modal on success.
    const handleDeleteBid = () => {
        deleteBid(bid._id, {
            onSuccess: () => {
                onClose(); // close the modal on success
            },
        });
    };



    return (
        <>
            <Card className="w-3/4">
                <CardBody className="flex flex-row w-full justify-between p-3">
                    <div className="flex flex-row items-center">
                        {bid.images && bid.images.length > 0 && (
                            <Image src={bid.images[0]} alt="image" className="w-[200px] h-[100px] rounded-xl shadow-xl" />
                        )}
                        <div className="flex flex-col gap-4 p-4">
                            <div className="flex flex-row gap-4">
                                <h1 className="font-bold text-xl">{bid.name}</h1>
                                <h1 className="text-sm flex items-center">
                                    <span
                                        className={
                                            bid.status === "approve"
                                                ? "text-green-500"
                                                : bid.status === "pending"
                                                    ? "text-yellow-400"
                                                    : bid.status === "inprogress"
                                                        ? "text-blue-500"
                                                        : bid.status === "accepted"
                                                            ? "text-purple-500"
                                                            : "text-red-500"
                                        }
                                    >
                                        ●
                                    </span>
                                    <span className="ml-1">{bid.status}</span>

                                </h1>

                            </div>
                            <p>{bid.description}</p>
                            {bid.category.map((c: any, index: number) => {
                                return <Chip key={index} color="primary">{c.name}</Chip>
                            })}
                            <div className="flex flex-row items-center gap-2">
                                <span className="font-bold text-blue-500">Seller</span>
                                <User
                                    avatarProps={{
                                        src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                                    }}
                                    description={
                                        <Link isExternal href="https://x.com/jrgarciadev" size="sm">
                                            {bid.createdBy.email}
                                        </Link>
                                    }
                                    name={bid.createdBy.name}
                                />
                            </div>
                            {bid.status === "accepted" && (
                                <div className="flex flex-row gap-2 items-center">
                                    <span className="font-bold text-yellow-500">Bid winner 👑</span>
                                    <User
                                        avatarProps={{
                                            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                                        }}
                                        description={
                                            <Link isExternal href="https://x.com/jrgarciadev" size="sm">
                                                {bid.acceptedBy.email}
                                            </Link>
                                        }
                                        name={bid.acceptedBy.name}
                                    />

                                </div>
                            )}

                            {bid.status === "inprogress" && bid.orders.length > 0 && (

                                <div className="flex flex-row gap-2 items-center">
                                    <span className="font-bold text-green-500">Highest bidder</span>
                                    <User
                                        avatarProps={{
                                            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                                        }}
                                        description={
                                            <Link isExternal href="https://x.com/jrgarciadev" size="sm">
                                                {bid.orders[bid.orders.length - 1].createdBy.email}
                                            </Link>
                                        }
                                        name={bid.orders[bid.orders.length - 1].createdBy.name}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 justify-center">
                        
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
                        {bid.incrementalValue && (
                            <div className=""> incremental Value {bid.incrementalValue}</div>
                        )}
                        {
                            bid.bidPublishedDate && (
                                <div className="text-sm text-gray-600">
                                    <strong>Bid Publish Date:</strong>{" "}
                                    {new Date(bid.bidPublishedDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                            )
                        }
                        {
                            bid.durationInDays && (
                                <div className="text-sm text-gray-600">
                                    <strong>Bid Duration : {bid.durationInDays} days</strong>{" "}

                                </div>
                            )
                        }

                        <div className="flex flex-row gap-4">
                            {bid.status == "pending" && (
                                <div className=" flex flex-row gap-4">
                                    <Button
                                        className="rounded-xl bg-green-700"
                                        isLoading={isApproving}
                                        onPress={() => approveBid({ bidId: bid._id, status: "approved" })}
                                    >
                                        Approve Bid
                                    </Button>
                                    <Button
                                        className="rounded-xl "
                                        isLoading={isRejeting}
                                        onPress={() => rejectBid({ bidId: bid._id, status: "rejected" })}
                                    >
                                        Reject Bid
                                    </Button>
                                </div>

                            )}
                            {bid.status == 'rejected' && (
                                <Button
                                    className="rounded-xl bg-green-700"
                                    isLoading={isApproving}
                                    onPress={() => approveBid({ bidId: bid._id, status: "approved" })}
                                >
                                    Approve Bid
                                </Button>
                            )}
                            <Button color="danger" className="rounded-xl" onPress={() => onOpen()}>Delete Bid</Button>

                        </div>

                    </div>
                </CardBody>
            </Card>
            <CustomModal heading="Delete Bid" isOpen={isOpen} onOpenChange={onOpenChange} bottomContent={
                <div className="flex flex-row gap-2">
                    <Button onPress={onClose}>Close</Button>
                    <Button
                        color="danger"
                        isLoading={isDeleting}
                        onPress={handleDeleteBid}
                    >
                        Submit
                    </Button>
                </div>
            }>
                <h2>Are You Sure You Want to Delete This Bid ?</h2>
            </CustomModal>
        </>
    );
}