"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes } from "@/core/api/apiRoutes";
import Link from "next/link";

export default function Bidder() {

  // Fetch all users with the role 'BIDDER'.
  const { data: allBidders, isFetching: loadingBidders } = useQuery({
    queryKey: ["get-all-bidders"],
    queryFn: async () => {
      return await getData(accountRoutes.getUsersByRole("BIDDER"), {});
    },
  });

  const bidders = allBidders?.data?.data?.users ?? [];
  
  // Find the maximum order count among all bidders.
  const maxOrderCount = Math.max(...bidders.map((b: any) => b.orderCount ?? 0));

  if (loadingBidders) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Bidders</h1>
        <span
          title="Top Bidder by Orders"
          aria-label="Top Bidder"
          role="img"
          className="text-yellow-500"
        >
          🏆 Top Bidder
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Orders</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bidders.map((user: any) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  <div className="flex items-center gap-2">
                    {Number(user.orderCount) === maxOrderCount && maxOrderCount > 0 && (
                      <span
                        title="Top Bidder by Orders"
                        aria-label="Top Bidder"
                        role="img"
                        className="text-yellow-500"
                      >
                        🏆
                      </span>
                    )}
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{user.role?.name || "Bidder"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${user.isBlocked ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                      }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  <Link href={`/admin/allBidder/${user._id}`}>
                    {user.orderCount ?? 0}
                  </Link>
                </td>
              </tr>
            ))}
            {bidders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No bidders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
