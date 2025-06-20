
//registing all the route related to user account
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
  getUserById: (id: string) => `/user/${id}`


}

//registing all the route related to user role
export const rolesRoutes = {
  getAll: "/role/all/roles",
  getPermission: "/role/all/permissions",
  update: "/role/update/permissions"
}

//registing all the route related to categories
export const categoryRoutes = {
  getAll: "category/all/categories"
}

//registing all the route related to bids
export const bidsRoutes = {
  createBid: "/bids/createBid/",
  myBids: "/bids/my/bids",
  getAll: "/bids/all",
  getBitDetails: "/bids/get/",
  approveBid: "bids/approveBid/:bidId",
  rejectBid: "bids/rejectBid/:bidId",
  deleteBid: '/bids/:bidId',
  adminBid: "/bids/admin/all",
  createOrder: "/order/create/",
  bidsByCount: "/bids/count",
  sellerInprogress: "/bids/get/my/inprogress",
  sellerAccepted: "/bids/get/my/accepted",
  acceptOrder: "/bids/accepted/",
  getApprovedBids: "/bids/all/approvedbids",
  getBidsBySellerId: "/bids/allbids/:sellerId",
  getSellerBids: (id: string) => `/bids/user/${id}`,
  getBidderBids: (id: string) => `/bids/user/bidder/all/bids/${id}`,
  getBid: (id: string) => `/bids/get/bid/bidId/${id}`,


}

//registing all the route related to analytics dashboard
export const analyticsRoutes = {
  getAnalyticsValue: "/analytics/total",
  getSellerAnalytics: "/analytics/seller",
  getBidderAnalytics: "analytics/bidder"
}
