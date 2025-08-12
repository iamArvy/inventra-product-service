import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateProductDto,
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto';
import { ProductRepository } from 'src/product/product.repository';
import { FilterQuery } from 'mongoose';
import { Product } from './product.schema';
import { SortOrder } from 'src/common/dto';

@Injectable()
export class ProductService {
  constructor(private repo: ProductRepository) {}

  async get(id: string) {
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

  async create(storeId: string, data: CreateProductDto) {
    const exists = await this.repo.findByStoreIdAndSku(storeId, data.sku);
    if (exists) {
      throw new BadRequestException('Product with this SKU already exists');
    }
    const product = await this.repo.create({ storeId, ...data });
    if (!product) throw new InternalServerErrorException('Product Not Created');
    return ProductDto.from(product);
  }

  async update(id: string, data: UpdateProductDto) {
    await this.repo.findByIdOrThrow(id);
    await this.repo.update(id, data);
    return { success: true };
  }

  async delete(id: string) {
    const product = await this.repo.findByIdOrThrow(id);
    if (product.deletedAt) {
      throw new BadRequestException('Product already deleted');
    }
    await this.repo.delete(id);
    return { success: true };
  }
}
