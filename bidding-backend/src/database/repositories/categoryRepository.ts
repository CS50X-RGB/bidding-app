import Category from "../models/categoryModel"
import { CategoryInterface, CategoryInterfaceGet } from "../../interfaces/categoryInterface";

class CategoryRepository {

  //This api is used to create a category
  public async createCategory(category: CategoryInterface): Promise<CategoryInterface | null> {
    try {
      const newCategory = await Category.create(category);
      return newCategory;
    } catch (e) {
      throw new Error(`New Error while creating category ${e}`);
    }
  }

  //This api is used to find the category by name
  public async findCategoryByName(name: string): Promise<boolean> {
    try {
      const category = await Category.findOne({ name }).lean();
      return category ? true : false;
    } catch (e) {
      return false;
    }
  }

  //This api is used to delete the category
  public async deleteCategory(name: string): Promise<CategoryInterface | null> {
    try {
      const category = await Category.findOneAndDelete({ name }).lean();
      return category;
    } catch (e) {
      throw new Error(`New Error while deleting Category ${e}`);
    }
  }

  //This api is used to get category by category id
  public async getIdByCategory(name: string): Promise<any | null> {
    try {
      const category = await Category.findOne({ name }).lean();
      return category;
    } catch (e) {
      throw new Error(`Error while getting Category ${name}`);
    }
  }

  //This api is used to get all category
  public async getAll(): Promise<any[]> {
    try {
      const category = await Category.find();
      return category;
    } catch (e) {
      throw new Error("Error while getting Categorys");
    }
  }


   //This api find categories whose names start with the given prefix (case-insensitive).
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
