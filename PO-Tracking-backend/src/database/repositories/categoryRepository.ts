import Category from "../models/categoryModel"
import { CategoryInterface, CategoryInterfaceGet } from "../../interfaces/categoryInterface";

class CategoryRepository {
  public async createCategory(category: CategoryInterface): Promise<CategoryInterface | null> {
    try {
      const newCategory = await Category.create(category);
      return newCategory;
    } catch (e) {
      throw new Error(`New Error while creating category ${e}`);
    }
  }
  public async findCategoryByName(name: string): Promise<boolean> {
    try {
      const category = await Category.findOne({ name }).lean();
      return category ? true : false;
    } catch (e) {
      return false;
    }
  }
  public async deleteCategory(name: string): Promise<CategoryInterface | null> {
    try {
      const category = await Category.findOneAndDelete({ name }).lean();
      return category;
    } catch (e) {
      throw new Error(`New Error while deleting Category ${e}`);
    }
  }
  public async getIdByCategory(name: string): Promise<any | null> {
    try {
      const category = await Category.findOne({ name }).lean();
      return category;
    } catch (e) {
      throw new Error(`Error while getting Category ${name}`);
    }
  }
  public async getAll(): Promise<any[]> {
    try {
      const category = await Category.find();
      return category;
    } catch (e) {
      throw new Error("Error while getting Categorys");
    }
  }

  public async findByPreifx(prefix: string) {
    try {
      const regex = new RegExp(`^${prefix}`, 'i');
      return await Category.find({ name: regex }).lean();
    } catch (error) {
      throw new Error(`Error while searching Categorys`);
    }
  }
}

export default CategoryRepository;
