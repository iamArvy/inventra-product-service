import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CreateProductDto,
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto';
import { ProductRepository } from 'src/product/product.repository';
import { FilterQuery, Types } from 'mongoose';
import { Product } from './product.schema';
import { SortOrder } from 'src/common/dto';
import { CategoryRepository } from 'src/category/category.repository';

@Injectable()
export class ProductService {
  constructor(
    private repo: ProductRepository,
    private categoryRepo: CategoryRepository,
  ) {}

  private readonly logger = new Logger(ProductService.name);

  async create(storeId: string, data: CreateProductDto) {
    const exists = await this.repo.findByStoreIdAndSku(storeId, data.sku);
    if (exists) {
      throw new BadRequestException('Product with this SKU already exists');
    }
    const categoryExists = await this.categoryRepo.findById(
      data.category.toString(),
    );
    if (!categoryExists || categoryExists.storeId !== storeId) {
      throw new BadRequestException('Category does not exist');
    }
    const product = await this.repo.create({ storeId, ...data });
    this.logger.log(`Product ${product.id} Created in store ${storeId}`);
    return ProductDto.from(await this.repo.create({ storeId, ...data }));
  }

  async get(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    const product = await this.repo.findByIdWithRelationships(id, ['category']);
    return ProductDto.from(product);
  }

  async list(query: ProductQueryDto) {
    const sortField = query?.sb ?? 'createdAt'; // default fallback
    const sortOrder = query?.order === SortOrder.DESC ? -1 : 1;
    const options = {
      page: query?.page ?? 1,
      limit: query?.pageSize ?? 10,
      sort: { [sortField]: sortOrder },
    };

    const filter: FilterQuery<Product> = {};
    if (query.name) filter.name = query.name;
    if (query.sku) filter.sku = query.sku;
    if (query.cid) filter.category = query.cid;
    if (query.sid) filter.storeId = query.sid;
    if (query.deleted)
      filter.deletedAt = query.deleted ? { $exists: true } : { $exists: false };

    if (query.tags && query.tags.length > 0) {
      filter.tags = { $in: query.tags };
    }

    if (query.minP !== undefined || query.maxP !== undefined) {
      filter.price = {
        ...(query.minP !== undefined && { $gte: Number(query.minP) }),
        ...(query.maxP !== undefined && { $lte: Number(query.maxP) }),
      };
    }

    if (query.minS !== undefined || query.maxS !== undefined) {
      filter.stock = {
        ...(query.minS !== undefined && { $gte: Number(query.minS) }),
        ...(query.maxS !== undefined && { $lte: Number(query.maxS) }),
      };
    }
    const result = await this.repo.list(filter, options);
    const mappedDocs = ProductDto.fromMany(result.docs);
    return {
      ...result,
      docs: mappedDocs,
    };
  }

  async update(id: string, data: UpdateProductDto) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    const product = await this.repo.findByIdWithRelationships(id, ['category']);

    if (product.deletedAt) {
      throw new BadRequestException('Product already deleted');
    }

    if (data.sku && data.sku !== product.sku) {
      const exists = await this.repo.findByStoreIdAndSku(
        product.storeId,
        data.sku,
      );
      if (exists && exists.id !== id) {
        throw new BadRequestException('Product with this SKU already exists');
      }
    }

    if (
      data.category &&
      data.category.toString() !== product.category._id.toString()
    ) {
      const categoryExists = await this.categoryRepo.findByIdOrThrow(
        data.category,
      );
      if (!categoryExists || categoryExists.storeId !== product.storeId) {
        throw new BadRequestException('Category does not exist');
      }
    }
    await this.repo.update(id, data);
    this.logger.log(`Product ${id} updated`);
    return { success: true };
  }

  async delete(id: string) {
    const product = await this.repo.findByIdOrThrow(id);
    if (product.deletedAt) {
      throw new BadRequestException('Product already deleted');
    }
    await this.repo.delete(id);
    this.logger.log(`Product ${id} deleted`);
    return { success: true };
  }
}
