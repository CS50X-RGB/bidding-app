import { CategoryInterface } from "../interfaces/categoryInterface";
import CategoryRepository from "../database/repositories/categoryRepository";
import { Response, Request } from "express";

class CategoryService {
    private categoryRepository: CategoryRepository;
    constructor() {
        this.categoryRepository = new CategoryRepository();
    }
    public async createCategory(req: Request, res: Response) : Promise<any | null> {
        try {
            const category: CategoryInterface = req.body;
            const existingRole = await this.categoryRepository.findCategoryByName(category.name);
            if (existingRole) {
                console.log("Category already exists:", category.name);
                return res.sendError(null, "Role Already Exists", 400);
            }
            let newCategory = await this.categoryRepository.createCategory(category);
            return res.sendFormatted(newCategory, "Role Created", 200);
        } catch (e: any) {
            console.error("Error while creating role:", e);
            return res.sendError(null, "Error while creating category", 400);
        }
    }
    public async getCategoryId(req: Request, res: Response) {
        try {
            const { name } = req.params;
            const role = await this.categoryRepository.getIdByCategory(name);
            console.log(`Role ${role}`);
            return res.sendFormatted(role);
        } catch (error) {
            return res.sendError(null, "Error while getting the role", 400);
        }
    }
    public async deleteCategory(req: Request, res: Response) {
        try {
            const { name }: CategoryInterface = req.body;
            const deleteRole = await this.categoryRepository.deleteCategory(name);
            return res.sendFormatted(deleteRole);
        } catch (e) {
            throw new Error(`Error while deleting role`);
        }
    }
    public async createCategories(names: CategoryInterface[]): Promise<void> {
        try {
            for (const category of names) {
                const existingRole = await this.categoryRepository.findCategoryByName(category.name);
                if (existingRole) {
                    console.log(`Role '${category.name}' already exists`);
                } else {
                    await this.categoryRepository.createCategory(category);
                    console.log(`Category '${category.name}' created successfully`);
                }
            }
        } catch (error: any) {
            console.error('Error while creating roles:', error.message);
        }
    }
    public async getCategory(req: Request, res: Response) {
        try {
            const search = req.query.search as string | undefined;
            console.log(search, "search");

            let roles = await this.categoryRepository.getAll();
            if (search && search.length > 0) {
                roles = await this.categoryRepository.findByPreifx(search);
                console.log(roles, "Inside here");
            }
            return res.sendArrayFormatted(roles, "Category Fetched", 200);
        } catch (e) {
            return res.sendError(e, "Error while getting the roles", 400);
        }
    }
}

export default CategoryService;
