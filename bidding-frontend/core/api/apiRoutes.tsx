export const accountRoutes = {
  login: "/user/login",
  signin: "/user/signin",
  updateImage: "/user/update/photo",
  block : "/user/block",
  getMyProfile: "/user/profile",
  getMineProfile : "/user/my/user",
  deleteById : "/user/remove",
  allUsers : '/user/all-users'
}
export const rolesRoutes = {
  getAll: "/roles/all",
}
export const categoryRoutes = {
  getAll : "category/all/categories"
}

export const bidsRoutes = {
  createBid : "/bids/create/",
  myBids : "/bids/my/bids",
  getAll : "/bids/all",
  getBitDetails : "/bids/get/",
  adminBid : "/bids/admin/all",
  createOrder : "/order/create/",
  bidsByCount : "/bids/count",
  sellerInprogress : "/bids/get/my/inprogress",
  sellerAccepted : "/bids/get/my/accepted",
  acceptOrder : "/bids/accepted/"
}
