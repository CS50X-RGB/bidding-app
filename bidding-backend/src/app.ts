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
roleService.createRoles(roles);
userService.createAdmin();

export default app;
