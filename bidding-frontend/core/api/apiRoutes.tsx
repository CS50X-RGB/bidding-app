export const accountRoutes = {
  login: "/user/login",
  signin: "/user/signin",
  updateImage: "/user/update/photo",
  block: "/user/block",
  getMyProfile: "/user/profile",
  getMineProfile: "/user/my/user",
  deleteById: "/user/remove",
  allUsers: '/user/all-users',
  getUsersByRole: (role: string) => `/user/role/${role}`,
  getUserById:(id:string)=>`/user/${id}`
  

}
export const rolesRoutes = {
  getAll: "/roles/all",
}
export const categoryRoutes = {
  getAll: "category/all/categories"
}

export const bidsRoutes = {
  createBid: "/bids/create/",
  myBids: "/bids/my/bids",
  getAll: "/bids/all",
  getBitDetails: "/bids/get/",
  approveBid: "bids/approveBid/:bidId",
  rejectBid: "bids/rejectBid/:bidId",
  adminBid: "/bids/admin/all",
  createOrder: "/order/create/",
  bidsByCount: "/bids/count",
  sellerInprogress: "/bids/get/my/inprogress",
  sellerAccepted: "/bids/get/my/accepted",
  acceptOrder: "/bids/accepted/",
  getApprovedBids: "/bids/all/approvedbids",
  getBidsBySellerId: "/bids/allbids/:sellerId",
  getSellerBids: (id:string)=>`/bids/user/${id}`,
  getBidderBids: (id: string) => `/bids/user/bidder/all/bids/${id}`,
  getBid:(id:string)=>`/bids/get/bid/bidId/${id}`,

}

export const analyticsRoutes = {
  getAnalyticsValue: "/analytics/total",
}
