"use client";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes } from "@/core/api/apiRoutes";
import React, { useEffect, useState } from "react";
import { Spinner, User, Link, Button, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Supplier({ children }: React.ReactNode) {
    const [user, setUser] = useState<any>({});

    const { data: getProfile, isFetched, isFetching } = useQuery({
        queryKey: ["getProfile"],
        queryFn: async () => {
            return await getData(accountRoutes.getMineProfile, {});
        },
    });
    const router = useRouter();
    // Set user data when fetched
    useEffect(() => {
        if (isFetched && getProfile?.data) {
            console.log(getProfile.data.data, "Profile");
            setUser(getProfile.data.data);
        }
    }, [isFetched, getProfile]);

    if (isFetching) {
        return (
            <div className="flex w-screen h-screen justify-center items-center">
                <Spinner title="Loading Admin Data" color="primary" />
            </div>
        );
    }
    // const chips = [
    //     {
    //         name: "View Users",
    //         link: "/admin/",
    //     }, {
    //         name: "Create Users",
    //         link: "/admin/create"
    //     }
    // ];
    const handleLogout = () => {
        Cookies.remove('auth');
        localStorage.removeItem('currentUser');
        router.push("/login");
    }
    const chips = [
        {
            name: "Create Bid",
            link: "/seller/create",
        },
        {
            name: "View Bids",
            link: "/seller/view"
        },
        {
            name : "View Inprogress Bids",
            link : "/seller/inprogress"
        },
        {
            name : "View Completed Bids",
            link : "/seller/accept"
        }
    ];
    return (
        <>
            <div className="flex flex-row justify-between p-4 w-full items-center">
                <div className="flex flex-col p-4 gap-2">
                    <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                    <div className="flex w-full gap-4 flex-row">
                        {chips.map((c: any, index: number) => {
                            return (
                                <Chip key={index} onClick={() => router.push(c.link)} color="primary" className="cursor-pointer">
                                    {c.name}
                                </Chip>
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <User
                        avatarProps={{
                            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                        }}
                        description={
                            <Link href="" size="sm">
                                {user.email}
                            </Link>
                        }
                        name={user.name}
                    />
                    <Button onPress={handleLogout} color="danger">Logout</Button>
                </div>
            </div>
            {children}
        </>
    );
}
