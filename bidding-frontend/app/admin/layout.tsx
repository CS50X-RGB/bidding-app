"use client";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes } from "@/core/api/apiRoutes";
import React, { useEffect, useState } from "react";
import { Spinner, Chip, Button, User, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { link } from "fs";

export default function Admin({ children }: React.ReactNode) {
    const [user, setUser] = useState<any>({});

    const { data: getProfile, isFetched, isFetching } = useQuery({
        queryKey: ["getProfile"],
        queryFn: async () => {
            return await getData(accountRoutes.getMyProfile, {});
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
    const chips = [
        {
            name: "Dashboard",
            link: "/admin/",
        }, {
            name: "Create Users",
            link: "/admin/create"
        },
        {
            name: "View All Bids",
            link: "/admin/view"
        },
        {
            name: "View All Sellers",
            link: "/admin/allSeller"
        },
        {
            name: "View All Bidders",
            link: "/admin/allBidder"
        }
    ];
    const handleLogout = () => {
        Cookies.remove('auth');
        localStorage.removeItem('currentUser');
        router.push("/login");
    }

    return (
        <>
            <div className="flex flex-row justify-between p-4 w-full items-center">
                <div className="flex flex-col p-4 gap-2">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
                <div className="flex flex-row gap-4 p-4">
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
