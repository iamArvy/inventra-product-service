import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CategoryDto,
  CategoryQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import { CategoryRepository } from './category.repository';
import { SortOrder } from 'src/common/dto';
import { FilterQuery } from 'mongoose';
import { Category } from './category.schema';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/product/product.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly repo: CategoryRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  /**
   * Create a new category
   * @param store_id - ID of the store
   * @param data - Category input data
   */
  async create(data: CreateCategoryDto) {
    const exists = await this.repo.findByName(data.storeId, data.name);
    if (exists)
      throw new BadRequestException(
        'Category with name already exist for this store',
      );
    const category = await this.repo.create(data);
    return CategoryDto.from(category);
  }

  /**
   * Get a category by ID
   * @param id - Category ID
   */
  async get(id: string) {
    const category = await this.repo.findByIdOrThrow(id);
    return CategoryDto.from(category);
  }

  /**
   * List categories with optional filtering and pagination
   * @param query - Category query parameters
   */
  async list(query: CategoryQueryDto) {
    const sortField = query?.sb ?? 'name';
    const sortOrder = query?.order === SortOrder.DESC ? -1 : 1;
    const options = {
      page: query?.page ?? 1,
      limit: query?.pageSize ?? 10,
      sort: { [sortField]: sortOrder },
    };

    const filter: FilterQuery<Category> = {};
    if (query.name) filter.name = query.name;
    if (query.sid) filter.storeId = query.sid;

    const result = await this.repo.list(filter, options);
    const mappedDocs = CategoryDto.fromMany(result.docs);
    return {
      ...result,
      docs: mappedDocs,
    };
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Partial category input data
   */
  async update(id: string, data: UpdateCategoryDto) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Category ID format');
    }

    const category = await this.repo.findByIdOrThrow(id);

    if (data.name && data.name !== category.name) {
      const exists = await this.repo.findByName(category.storeId, data.name);
      if (exists && exists.id !== id)
        throw new BadRequestException('Category with name already exists');
    }

    await this.repo.update(id, data);
    this.logger.log(`Category ${id} updated successfully`);
    return { success: true };
  }

  /**
   * Delete a category
   * @param id - Category ID
   */
  async delete(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID format');
    }
    await this.repo.findByIdOrThrow(id);
    const productCount = await this.productRepo.count({ category: id });
    if (productCount > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing products',
      );
    }
    await this.repo.delete(id);
    this.logger.log(`Category ${id} deleted successfully`);
    return { success: true };
  }
}
