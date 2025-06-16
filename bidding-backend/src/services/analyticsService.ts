import { BidStatus } from "../database/models/bidsModel";
import BidsRepository from "../database/repositories/bigRepository";
import RoleRepository from "../database/repositories/roleRepository";
import UserRepository from "../database/repositories/userRepository";
import { Request, Response } from "express";
import { roles } from "../app";


class AnalyticsService {
    //Defing types for repositories(dependency injection)
    private bidRepository: BidsRepository;
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;

    constructor() {
        this.bidRepository = new BidsRepository();
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
    }

    public async getDashboardAnalytics(req: Request, res: Response): Promise<any | null> {
        try {

            const totalBids = await this.bidRepository.getTotalBidsCount();
            const totalBidValues = await this.bidRepository.getTotalBidsValue();
            const totalBidsInProgessValue = await this.bidRepository.getTotalBidsValue(BidStatus.INPROGRESS);
            const totalBidsIAcceptedValue = await this.bidRepository.getTotalBidsValue(BidStatus.ACCEPTED);
            const totalBidsCountByStatus = await this.bidRepository.getBidsCountByStatus();

            const userData: Record<string, number> = {};

            for (const role of roles) {
                const roleObject = await this.roleRepository.getIdByRole(role.name);
                const userCount = await this.userRepository.getUserCountByRole(roleObject._id);
                userData[role.name] = userCount;
            }

            const dashboardAnalyticsData = {
                totalBids,
                totalBidValues,
                totalBidsIAcceptedValue,
                totalBidsInProgessValue,
                userData,
                totalBidsCountByStatus

            }

            return res.sendFormatted(dashboardAnalyticsData, "Data fethched", 200);


        } catch (error: any) {
            return res.sendError(error, "error fetching data", 501)
        }
    }

    public async getSellerDashboardAnalytics(req: Request, res: Response) {
        try {
            if (!req.user || !req.user._id) {
                return res.sendError(null, "Unauthorized: User not found", 401);
            }
            const sellerId = req.user._id; // make sure your auth middleware sets this!
            const sellerIdStr = sellerId.toString();

            // ✅ TEST LOGS — this will print in your terminal when you hit this route!
            console.log(
                "ALL =>",
                await this.bidRepository.getTotalBidsValueForSeller(sellerIdStr)
            );
            console.log(
                "ACCEPTED =>",
                await this.bidRepository.getTotalBidsValueForSeller(sellerIdStr, BidStatus.ACCEPTED)
            );

            const [
                totalBids,
                totalBidsValue,
                totalBidsInProgressValue,
                totalBidsAcceptedValue,
                totalBidsRejectedValue,
                totalBidsExpiredValue,
                totalBidsCountByStatus,
            ] = await Promise.all([
                this.bidRepository.getTotalBidsCountForSeller(sellerIdStr),
                this.bidRepository.getTotalBidsValueForSeller(sellerIdStr),
                this.bidRepository.getTotalBidsValueForSeller(sellerIdStr, BidStatus.INPROGRESS),
                this.bidRepository.getTotalBidsValueForSeller(sellerIdStr, BidStatus.ACCEPTED),
                this.bidRepository.getTotalBidsValueForSeller(sellerIdStr, BidStatus.REJECTED),
                this.bidRepository.getTotalBidsValueForSeller(sellerIdStr, BidStatus.EXPIRED),
                this.bidRepository.getBidsCountByStatusForSeller(sellerIdStr),
            ]);

            const data = {
                totalBids,
                totalBidsValue,
                totalBidsInProgressValue,
                totalBidsAcceptedValue,
                totalBidsRejectedValue,
                totalBidsExpiredValue,
                totalBidsCountByStatus,
            };

            return res.sendFormatted(data, "Seller analytics fetched", 200);
        } catch (error) {
            return res.sendError(error, "Error fetching seller analytics", 500);
        }
    }

    public async getBidderDashboardAnalytics(req: Request, res: Response) {
  try {
    if (!req.user || !req.user._id) {
      return res.sendError(null, "Unauthorized", 401);
    }
    const bidderId = req.user._id.toString();

    const [
      totalOrdersPlaced,
      totalOrdersAccepted,
      totalAmountPlaced,
      totalAmountAccepted,
      totalBidsParticipated
    ] = await Promise.all([
      this.bidRepository.getTotalOrdersForBidder(bidderId),
      this.bidRepository.getAcceptedOrdersForBidder(bidderId),
      this.bidRepository.getTotalBidAmountForBidder(bidderId),
      this.bidRepository.getAcceptedBidAmountForBidder(bidderId),
      this.bidRepository.getTotalBidsParticipatedForBidder(bidderId)
    ]);

    const winningRate =
      totalOrdersPlaced > 0
        ? (totalOrdersAccepted / totalOrdersPlaced) * 100
        : 0;

    const data = {
      totalOrdersPlaced,
      totalOrdersAccepted,
      totalOrdersPending: totalOrdersPlaced - totalOrdersAccepted,
      totalAmountPlaced,
      totalAmountAccepted,
      totalBidsParticipated,
      winningRate: `${winningRate.toFixed(2)}%`
    };

    return res.sendFormatted(data, "Bidder analytics fetched", 200);
  } catch (error) {
    return res.sendError(error, "Error fetching bidder analytics", 500);
  }
}


}

export default AnalyticsService;