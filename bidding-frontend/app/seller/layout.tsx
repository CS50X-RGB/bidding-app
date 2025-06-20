"use client";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes } from "@/core/api/apiRoutes";
import React, { useEffect, useState } from "react";
import { Spinner, User, Link, Button, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { currentUser } from "@/core/api/localStorageKeys";

export default function Supplier({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>({});

    const [chips, setChips]: any[] = useState<any[]>([]);

    //fetches the user profile 
    const { data: getProfile, isFetched, isFetching } = useQuery({
        queryKey: ["getProfile"],
        queryFn: async () => {
            const url = localStorage.getItem("ROLE") === "ADMIN" ? accountRoutes.getMyProfile : accountRoutes.getMineProfile;
            return await getData(url, {});
        },
    });

    // After fetching the user profile, extract permissions, store allowed links in cookies, and update user state.
    useEffect(() => {
        if (isFetched && getProfile?.data) {
            const permissions: any[] = [];
            if (getProfile.data.data.role && getProfile.data.data.role.permissions) {
                getProfile?.data?.data?.role?.permissions.map((p: any) => {
                    const obj = {
                        name: p.name,
                        link: p.link
                    }

                    permissions.push(obj);

                });
                if (getProfile.data.data.role && getProfile.data.data.role?.name === "ADMIN") {
                    const adminNav = {
                        name: "Permissions",
                        link: "/admin/permission"
                    }

                    permissions.push(adminNav);
                }
                const links = permissions.map((p) => p.link);
                Cookies.set("allowedLinks", JSON.stringify(links), { path: "/" });
                setChips(permissions);
            }
            setUser(getProfile.data.data);
        }
    }, [isFetched, getProfile]);

    const router = useRouter();

    // fucntion to Set user data when fetched
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

    //fucntion to handle the logout 
    const handleLogout = () => {
        Cookies.remove(currentUser);
        Cookies.remove("nextToken");
        Cookies.remove("allowedLinks");
        Cookies.remove("userRole");
        localStorage.removeItem("ROLE");
        localStorage.removeItem(currentUser);
        router.push("/login");
    }

    return (
        <>
            <div className="flex flex-row justify-between p-4 w-full items-center">
                <div className="flex flex-col p-4 gap-2">
                    <h1 className="text-2xl font-bold">{getProfile?.data?.data?.role?.name} Dashboard</h1>
                    <div className="flex flex-wrap gap-4 flex-row">
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
