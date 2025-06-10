import { Card, CardHeader, CardBody, Image, CardFooter } from '@heroui/react'
import Link from 'next/link';
import React from 'react'

type Props = {
    bid: any; // You can replace `any` with a proper type later
};
function formatDateTime(dateString: string): string {
    const d = new Date(dateString)
    const pad = (n: number) => (n < 10 ? '0' + n : n)

    const day = pad(d.getDate())
    const month = pad(d.getMonth() + 1)
    const year = d.getFullYear()

    const hours = pad(d.getHours())
    const minutes = pad(d.getMinutes())
    const seconds = pad(d.getSeconds())

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}
export default function SellerBidCard({ bid }: Props) {
    return (
        <Link href={`/admin/bid/${bid._id}`}>
            <Card className="py-4">
                <CardHeader className="pb-0 pt-2 px-4 flex-row justify-between items-start">
                    <div className="">
                        <p className="text-tiny uppercase font-bold">{bid.name}</p>
                        <h4 className="font-bold text-large">RS {bid.maxtotalPrice}</h4>
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
                <CardFooter className="flex flex-col text-small ">
                    <p>{bid.description}</p>
                    <div className="flex flex-row gap-4">
                        <small className="text-default-500">{formatDateTime(bid.createdOn)}</small>
                        {/* <p>Category {bid.category[0].name}</p> */}
                    </div>
                </CardFooter>

            </Card>
        </Link>

    )
}
