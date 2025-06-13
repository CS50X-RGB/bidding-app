
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData } from "@/core/api/apiHandler";
import { bidsRoutes } from "@/core/api/apiRoutes";

// Mutation function to call DELETE API
const deleteBidById = async (bidId: string) => {
  // For consistency, use your bidsRoutes
  const url = bidsRoutes.deleteBid.replace(":bidId", bidId);
  return await deleteData(url,{});
};

export const useDeleteBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBidById,
    onSuccess: () => {
      // Invalidate related bids query
      queryClient.invalidateQueries({ queryKey: ["get-all-bids"] });
    },
  });
};
