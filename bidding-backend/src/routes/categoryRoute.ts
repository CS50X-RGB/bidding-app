import { Router } from "express";
import CategoryService from "../services/categoryService";
import CategoryMiddleware from "../middleware/categoryMiddleware";



const router = Router();
const categoryService = new CategoryService();
const categoryMiddleware = new CategoryMiddleware();

//This route is to create the category
router.post('/',
    categoryMiddleware.createCategory.bind(categoryMiddleware),
    categoryService.createCategory.bind(categoryService)
);

//This route is to get the category by name
router.get('/:name',
    categoryMiddleware.getCategory.bind(categoryMiddleware),
    categoryService.getCategoryId.bind(categoryService),
);

//This route is to get all the categories
router.get('/all/categories', 
    categoryService.getCategory.bind(categoryService)
);
export default router;
