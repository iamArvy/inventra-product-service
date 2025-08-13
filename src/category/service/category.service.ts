import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CategoryDto,
  CategoryQueryDto,
  CreateCategoryDto,
  PaginatedCategoryDto,
  UpdateCategoryDto,
} from '../dto';
import { CategoryRepository } from '../repository';
import { SortOrder } from 'src/common/dto';
import { FilterQuery } from 'mongoose';
import { Category } from '../schema';
import { ProductRepository } from 'src/product/repository';

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
    const { sortBy, order, page, pageSize, name, storeId } = query;
    const sortField = sortBy ?? 'name';
    const sortOrder = order === SortOrder.DESC ? -1 : 1;
    const options = {
      page: page ?? 1,
      limit: pageSize ?? 10,
      sort: { [sortField]: sortOrder },
    };

    const filter: FilterQuery<Category> = {};
    if (name) filter.name = query.name;
    if (storeId) filter.storeId = storeId;

    const result = await this.repo.list(filter, options);
    return PaginatedCategoryDto.from(result);
    // const mappedDocs = CategoryDto.fromMany(result.docs);
    // return {
    //   ...result,
    //   docs: mappedDocs,
    // };
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Partial category input data
   */
  async update(id: string, data: UpdateCategoryDto) {
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

  // implement events
  // implement createMany and deleteMany
}
