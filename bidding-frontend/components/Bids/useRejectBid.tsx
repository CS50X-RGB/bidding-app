import { useMutation, useQueryClient } from "@tanstack/react-query"
import { patchData } from "@/core/api/apiHandler"
import { bidsRoutes } from "@/core/api/apiRoutes"

//Mutation function  to call PATCH API to reject the bid
const patchBidStatus = async ({ bidId, status }: { bidId: any; status: any }) => {
    const url = bidsRoutes.rejectBid.replace(":bidId", bidId);
    return await patchData(url, {}, {})
}

export const useRejectBid = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: patchBidStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-bids"] })
        },
    })
}
