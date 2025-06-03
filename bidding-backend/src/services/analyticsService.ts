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
            const totalBidsCountByStatus=await this.bidRepository.getBidsCountByStatus();

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

            return res.sendFormatted(dashboardAnalyticsData,"Data fethched",200);


        } catch (error: any) {
            return res.sendError(error,"error fetching data",501)
        }
    }

}

export default AnalyticsService;