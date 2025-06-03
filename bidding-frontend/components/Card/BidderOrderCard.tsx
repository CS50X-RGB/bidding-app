
import { Card, CardHeader, CardBody, Image, CardFooter } from '@heroui/react'
import React from 'react'

type Props = {
    bid: any; // You can replace `any` with a proper type later
    orderAmount: any;
    createdBy: any
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
export default function BidderOrderCard({ bid, orderAmount, createdBy }: Props) {
    return (

        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-row justify-between items-start">
                <div className="">
                    <p className="text-tiny uppercase font-bold">{bid.name}</p>
                    <h4 className="font-bold text-large">RS {bid.maxtotalPrice}</h4>
                </div>
                <div className="">
                    <span
                        className={
                            bid.category[0].name === "Appliances"
                                ? "text-green-500"
                                : bid.category[0].name === "Furniture"
                                    ? "text-yellow-400"
                                    : bid.category[0].name === "Pets"
                                        ? "text-blue-500"
                                        : bid.category[0].name === "other"
                                            ? "text-purple-500"
                                            : "text-red-500"
                        }
                    >
                        ●
                    </span>
                    <small className="ml-1">{bid.category[0].name}</small>
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

                <div className="flex flex-row gap-4">


                    <h1 className='font-bold text-large'><span className='text-green-400 font-normal text-sm'>Bidding Amout </span>{orderAmount}</h1>
                </div>
                <p>{bid.description}</p>
            </CardFooter>

        </Card>

    )
}
