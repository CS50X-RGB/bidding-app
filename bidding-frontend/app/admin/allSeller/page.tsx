"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes, bidsRoutes } from "@/core/api/apiRoutes";
import Link from "next/link";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";

export default function Seller() {
  const { data: allSellers, isFetching: loadingSellers } = useQuery({
    queryKey: ["get-all-sellers"],
    queryFn: async () => {
      return await getData(accountRoutes.getUsersByRole("SELLER"), {});
    },
  });

  console.log(allSellers);


  const sellers = allSellers?.data?.data?.users ?? [];
  const maxBidCount = Math.max(...sellers.map((b: any) => b.bidCount ?? 0));



  if (loadingSellers) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <div className=" flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-4">All Sellers</h1>
        <span title="Top Seller by Bids" aria-label="Top Seller" role="img" className="text-yellow-500">
          🏆 Top Seller
        </span>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Bids</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sellers.map((user: any) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    {Number(user.bidCount) === maxBidCount && (
                      <span title="Top Seller by Bids" aria-label="Top Seller" role="img" className="text-yellow-500">
                        🏆
                      </span>
                    )}
                    {user.name}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  {user.role?.name || "Seller"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link href={`/admin/allSeller/${user._id}`}>
                    {user.bidCount ?? 0}
                  </Link>

                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
