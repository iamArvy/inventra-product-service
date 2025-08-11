import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductDto,
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { PaginateModel, Types } from 'mongoose';
import { SortOrder } from 'src/common/dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private model: PaginateModel<ProductDocument>,
  ) {}
  create(store_id: string, data: CreateProductDto) {
    console.log('Creating product with data:', store_id);
    return this.model.create({
      store_id,
      ...data,
    });
  }

  findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model.findById(id).exec();
  }

  async findByIdOrThrow(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model
      .findById(id)
      .orFail(new NotFoundException('Product not found'))
      .exec();
  }

  async findByIdWithRelationships(
    id: string,
    relationships: string[],
  ): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model
      .findById(id)
      .populate(relationships)
      .orFail(new NotFoundException('Product not found'))
      .exec();
  }

  async list(query: ProductQueryDto) {
    const sortField = query?.sortBy ?? 'createdAt'; // default fallback
    const sortOrder = query?.order === SortOrder.DESC ? -1 : 1;
    const options = {
      page: query?.page ?? 1,
      limit: query?.pageSize ?? 10,
      sort: { [sortField]: sortOrder },
    };

    const filter = {} as Record<string, any>;
    if (query.name) filter.name = query.name;
    if (query.sku) filter.sku = query.sku;
    if (query.categoryId) filter.category = query.categoryId;
    if (query.storeId) filter.store_id = query.storeId;
    if (query.deleted)
      filter.deletedAt = query.deleted ? { $exists: true } : { $exists: false };
    // if (query.includeDeleted)
    //   filter.deleted_at = { $exists: true };

    const result = await this.model.paginate(this.model.find(filter), options);
    const mappedDocs = ProductDto.fromMany(result.docs);
    return {
      ...result,
      docs: mappedDocs,
    };
  }

  update(id: string, data: UpdateProductDto) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    console.log('Deleting product with ID:', id);
    return this.model.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });
  }
}
