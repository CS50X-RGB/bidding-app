import { Request, Response } from "express";
import BidsRepository from "../database/repositories/bigRepository";
import { BidInterfaceCreation } from "../interfaces/bidInterface";
import { AWS_BUCKET } from "../config/config";
import s3 from "../config/aws_config";

class BidsService {
    private bidRepository: BidsRepository;
    constructor() {
        this.bidRepository = new BidsRepository();
    }
    public async createBid(req: Request, res: Response): Promise<any | null> {
        try {
            const bid: BidInterfaceCreation = req.body;
            if (!req.user) {
                return res.sendError("User not logged in", "User not logged in", 400);
            }
            const user = req.user._id;
            let bidObject = {
                ...bid,
                createdBy: user,
            }
            let imagesUrl: string[] = [];
            console.log(req.files, "Files");
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                try {
                    const result = await s3.listBuckets().promise();
                    console.log('AWS Connection Success: ', result);

                    // Prepare the upload promises
                    const uploadPromises = req.files.map((file: Express.Multer.File) => {
                        if (!AWS_BUCKET) {
                            throw new Error("AWS_BUCKET_NAME is not defined");
                        }

                        const params = {
                            Bucket: AWS_BUCKET,
                            Key: `bids/${Date.now()}-${file.originalname}`,
                            Body: file.buffer,
                            ContentType: file.mimetype,
                            //   ACL: "public-read"
                        };

                        console.log("Uploading to S3 with params:", params);

                        return s3.upload(params).promise()  // Upload the file to S3
                            .then((res) => {
                                console.log("Uploaded to S3:", res.Location);  // Log successful upload
                                return res.Location;  // Return the URL of the uploaded file
                            })
                            .catch((error) => {
                                console.error("Error uploading file to S3:", error);
                                throw new Error("S3 upload failed");
                            });
                    });

                    // Wait for all uploads to finish
                    imagesUrl = await Promise.all(uploadPromises);
                    console.log("Uploaded to S3:", imagesUrl);

                    // Save the URLs in the bid object
                    bidObject.images = imagesUrl;
                } catch (error) {
                    console.error("Error uploading files to S3:", error);
                    return res.sendError(error, "Error uploading files", 500);  // Return error response
                }
            }

            console.log(bidObject, "Bid Object");
            const bidDoc = await this.bidRepository.createBid(bidObject);
            return res.sendFormatted(bidDoc, "Created A Bid", 200);
        } catch (error) {
            return res.sendError(error, "Error file while creating Bid", 400);
        }
    }
    public async getBidByMe(req: Request, res: Response): Promise<any | null> {
        try {
            if (!req.user) {
                return res.sendError("User not logged in", "User not logged in", 400);
            }
            const user = req.user._id;
            const bidDoc = await this.bidRepository.getAllBidsByUser(user);
            return res.sendArrayFormatted(bidDoc, "Got All My Bids", 200);
        } catch (error) {
            return res.sendError(error, "Error file while creating Bid", 400);
        }
    }
    public async getAllBids(req: Request, res: Response): Promise<any | null> {
        try {
            const bidDoc = await this.bidRepository.getAllBids();
            return res.sendArrayFormatted(bidDoc, "Got All My Bids", 200);
        } catch (error) {
            return res.sendError(error, "Error file while creating Bid", 400);
        }
    }
    public async getBidByCategory(req: Request, res: Response): Promise<any | null> {
        try {
            const catId = req.params.catId;
            const bidDoc = await this.bidRepository.getBidsByCategory(catId);
            return res.sendArrayFormatted(bidDoc, "Got All Bids By Category", 200);
        } catch (error) {
            return res.sendError(error, "Error file while creating Bid", 400);
        }
    }
    public async getBidsCountByCategory(req: Request, res: Response): Promise<any | null> {
        try {
            const countByCategory = await this.bidRepository.getBidsCountByCat();
            return res.sendFormatted({ data: countByCategory }, "Fetched Bids By Category", 200);
        } catch (error) {
            return res.sendError(error, "Error caused during fetching data", 500);
        }
    }
    public async updateOrder(req: Request, res: Response): Promise<any | null> {
        try {
            const bidId: any = req.params.bidId;
            const orderId: any = req.params.orderId;
            const acceptedOrder = await this.bidRepository.acceptOrder(bidId, orderId);
            return res.sendFormatted(acceptedOrder, "Accepted the order", 200);
        } catch (error) {
            return res.sendError(null, "Error While Accepting the Order", 400);
        }
    }
    public async getAcceptedOrders(req: Request, res: Response): Promise<any | null> {
        try {
            const acceptedBids = await this.bidRepository.getAllAcceptedOrders();
            return res.sendArrayFormatted({ bids: acceptedBids }, "Fetched All Accepted bids", 200);
        } catch (error) {
            return res.sendError(error, "Error while accepted Bids", 500);
        }
    }
    public async getAcceptedOrdersByMe(req: Request, res: Response): Promise<any | null> {
        try {
            if (!req.user) {
                throw new Error(`Not Logged In`);
            }
            const userId = req.user._id;
            const acceptedBids = await this.bidRepository.getAllAcceptedOrdersByMe(userId);
            return res.sendArrayFormatted({ bids: acceptedBids }, "Fetched All Accepted bids", 200);
        } catch (error) {
            return res.sendError(error, "Error while accepted Bids", 500);
        }
    }
    public async getRejectedOrders(req: Request, res: Response): Promise<any | null> {
        try {
            const rejectedBids = await this.bidRepository.getAllRejecteddOrders();
            return res.sendArrayFormatted({ bids: rejectedBids }, "Fetched All Rejected bids", 200);
        } catch (error) {
            return res.sendError(error, "Error while accepted Bids", 500);
        }
    }
    public async getOrdersByBidId(req: Request, res: Response): Promise<any | null> {
        try {
            const bidId: any = req.params.bidId;
            const bidObject = await this.bidRepository.getOrdersByBidId(bidId);
            console.log(bidObject, "Full Bid Object");
            return res.sendFormatted(bidObject, "Fetched Bid Details", 200);
        } catch (error) {
            return res.sendError(error, "Fetching Bid Details failed", 400);
        }
    }
    public async getMyInprogressBids(req: Request, res: Response): Promise<any | null> {
        try {
            if (!req.user) {
                return res.sendError(null, "Your not logeed in", 400);
            }
            const userId = req.user?._id;
            const bids = await this.bidRepository.getMyBidsInProgress(userId);
            return res.sendArrayFormatted(bids, "Fetched All Bids", 200);
        } catch (error) {
            return res.sendError(error, "Error while getting bids", 400);
        }
    }

    public async approveBid(req: Request, res: Response): Promise<any | null> {
        try {
            const bidId: any = req.params.bidId;
            const updatedBid = await this.bidRepository.approveBid(bidId);
            return res.sendFormatted(updatedBid, "Bid approved successfully", 200);
        } catch (error) {
            return res.sendError(error, "Error while approving bid", 400);
        }
    }
    public async rejectBid(req: Request, res: Response): Promise<any | null> {
        try {
            const bidId: any = req.params.bidId;
            const updatedBid = await this.bidRepository.rejectBid(bidId);
            return res.sendFormatted(updatedBid, "Bid Rejected successfully", 200);
        } catch (error) {
            return res.sendError(error, "Error while rejecting bid", 400);
        }
    }

    public async getApprovedBid(req: Request, res: Response): Promise<any | null> {
        try {
            const approvedBid = await this.bidRepository.getApprovedBids();
            return res.sendArrayFormatted(approvedBid, "approved bids fetched", 200);
        } catch (error) {
            return res.sendError(error, "Error while fetching the approved bids", 400);
        }
    }

    public async getBidsBySellerId(req: Request, res: Response): Promise<any | null> {
        try {
            const sellerId: any = req.params.id
            const bids = await this.bidRepository.getBidsBySellerId(sellerId);
            return res.sendArrayFormatted(bids, "Bids of seller", 200);

            if (!bids) {
                return res.sendError(null, "No bids found for the seller", 404);
            }
        } catch (error) {
            return res.sendError(error, "Error while fetching the  bids", 400);
        }
    }

    public async getBidsByUserId(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.params.id;
            if (!userId) {
                return res.sendError("Missing user ID", "Missing user ID", 400);
            }

            const bidDoc = await this.bidRepository.getAllBidsBySeller(userId);
            return res.sendArrayFormatted(bidDoc, "Got All Bids By User", 200);
        } catch (error) {
            return res.sendError(error, "Failed to get bids by user", 500);
        }
    }

    public async getBidsByBidderOrders(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.params.id;
            if (!userId) return res.sendError("Missing user ID", "Missing user ID", 400);

            const bidDocs = await this.bidRepository.getAllBidsWithOrdersByUser(userId);
            return res.sendArrayFormatted(bidDocs, "Got All Bids With User's Orders", 200);
        } catch (error) {
            return res.sendError(error, "Failed to get bids by user's orders", 500);
        }
    }


}

export default BidsService;
