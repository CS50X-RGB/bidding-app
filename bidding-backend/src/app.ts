import express from 'express';
import connectDB from './database/connection';
import routes from './routes'
import cors from 'cors';
import { responseFormatter } from './utils/reponseFormatter';
import UserService from './services/userService';
import RoleService from './services/roleService';
import { RoleInterface } from './interfaces/roleInterface';
import { CategoryInterface } from './interfaces/categoryInterface';
import CategoryService from './services/categoryService';
import './cron/expireBidsJob'
import { PermissionCreate } from './interfaces/permissionInterface';
const app = express();


app.use(cors({
   origin: ['http://localhost:3000', 'https://bidding.swyftcore.in'],
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
   credentials: true
}));

app.use(express.json());
app.use(responseFormatter);
app.use('/api', routes);

connectDB();

const permissions: PermissionCreate[] = [
   {
      name: "Dashboard",
      link: "/admin/",
   }, {
      name: "Create Users",
      link: "/admin/create"
   },
   {
      name: "View All Bids",
      link: "/admin/view"
   },
   {
      name: "View All Sellers",
      link: "/admin/allSeller"
   },
   {
      name: "View All Bidders",
      link: "/admin/allBidder"
   },

   {
      name: "Bidder DashBoard",
      link: "/bidder"
   },
   {
      name: "Live Bids",
      link: "/bidder/view",
   },
   {
      name: "Seller Dashboard",
      link: "/seller",
   },
   {
      name: "Create Bid",
      link: "/seller/create",
   },
   {
      name: "View Bids",
      link: "/seller/view"
   },
   {
      name: "View Inprogress Bids",
      link: "/seller/inprogress"
   },
   {
      name: "View Completed Bids",
      link: "/seller/accept"
   },
];

export const roles: RoleInterface[] = [
   {
      "name": "ADMIN",
   },
   {
      "name": "SELLER",
   },
   {
      "name": "BIDDER"
   }
]
const categories: CategoryInterface[] = [
   {
      "name": "Appliances",
   },
   {
      "name": "Furniture"
   },
   {
      "name": "Pets"
   }
]
const userService = new UserService();
const roleService = new RoleService();
const categoryService = new CategoryService();
categoryService.createCategories(categories);
roleService.createPermission(permissions);
roleService.createRoles(roles);
userService.createAdmin();

export default app;
