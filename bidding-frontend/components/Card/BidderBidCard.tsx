import { Card, CardHeader, CardBody, Image, CardFooter, User, Accordion, AccordionItem } from '@heroui/react';
import Link from 'next/link';
import React from 'react';

type Props = {
    bid: any;
    orders: any[]; // ✅ better type
};

function formatDateTime(dateString: string): string {
    const d = new Date(dateString);
    const pad = (n: number) => (n < 10 ? '0' + n : n);

    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();

    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export default function BidderBidCard({ bid, orders }: Props) {
    const bidOrders = orders.filter(order => order.bid?._id === bid._id);

    return (
        <Card className="py-4">
            {/* ✅ Add header, body, or image here if you have them */}
            <CardHeader className="pb-0 pt-2 px-4 flex-row justify-between items-start">
                <div className="">
                    <p className="text-tiny uppercase font-bold">{bid.name}</p>
                    <h4 className="font-bold text-large text-green-500">RS {bid.maxtotalPrice}</h4>
                    <h4 className="font-light text-sm">Base Price RS {bid.totalPrice}</h4>

                </div>
                <div className="">
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
                    <small className="ml-1">{bid.status}</small>
                </div>



            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="h-[180px] w-full flex items-center justify-center rounded-xl">
                    {bid.images && bid.images.length > 0 ? (
                        <Image
                            alt="Bid image"
                            className="object-cover h-[200px] w-full rounded-xl"
                            src={bid.images[0]}
                        />
                    ) : (
                        <span className="text-gray-500 text-sm">NO IMAGE</span>
                    )}
                </div>
            </CardBody>

            <CardFooter className="flex flex-col text-small">
                <p>{bid.description}</p>

                <div className="flex flex-col gap-4">
                    <User
                        className="py-4"
                        avatarProps={{
                            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                        }}
                        description={<Link href="">{bid.createdBy.email}</Link>}
                        name={bid.createdBy.name}
                    />
                </div>

                <Accordion className="mt-4">
                    <AccordionItem
                        key="wrapper"
                        aria-label="View My Orders"
                        title="View My Orders"
                    >
                        <Accordion>
                            {bidOrders.length > 0 ? (
                                bidOrders.map((order, index) => (
                                    <AccordionItem
                                        key={order._id}
                                        aria-label={`Order ${index + 1}`}
                                        title={`Order #${index + 1}`}
                                    >
                                        <p>Amount: Rs {order.bidAmount}</p>
                                        <p>Placed at: {formatDateTime(order.createdAt)}</p>
                                    </AccordionItem>
                                ))
                            ) : (
                                <AccordionItem
                                    key="no-orders"
                                    aria-label="No Orders"
                                    title="No Orders"
                                >
                                    <p>No orders for this bid.</p>
                                </AccordionItem>
                            )}
                        </Accordion>
                    </AccordionItem>
                </Accordion>

                
            </CardFooter>
        </Card>
    );
}
