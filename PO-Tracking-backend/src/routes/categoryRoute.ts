import { Router } from "express";
import CategoryService from "../services/categoryService";
import CategoryMiddleware from "../middleware/categoryMiddleware";



const router = Router();
const categoryService = new CategoryService();
const categoryMiddleware = new CategoryMiddleware();


router.post('/',
    categoryMiddleware.createCategory.bind(categoryMiddleware),
    categoryService.createCategory.bind(categoryService)
);
router.get('/:name',
    categoryMiddleware.getCategory.bind(categoryMiddleware),
    categoryService.getCategoryId.bind(categoryService),
);

router.get('/all/categories', categoryService.getCategory.bind(categoryService));
export default router;
