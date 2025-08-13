import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schema';
import {
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private model: PaginateModel<ProductDocument>,
  ) {}

  create(data: Product) {
    return this.model.create(data);
  }

  findById(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model.findById(id).exec();
  }

  findByStoreIdAndSku(storeId: string, sku: string) {
    return this.model
      .findOne({
        storeId,
        sku,
      })
      .exec();
  }

  findByIdOrThrow(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model
      .findById(id)
      .orFail(new NotFoundException('Product not found'))
      .exec();
  }

  findByIdWithRelationships(
    id: string,
    relationships: string[],
  ): Promise<Product> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model
      .findById(id)
      .populate(relationships)
      .orFail(new NotFoundException('Product not found'))
      .exec();
  }

  list(filter: FilterQuery<Product>, options: PaginateOptions) {
    return this.model.paginate(this.model.find(filter), options);
  }

  count(filter: FilterQuery<Product>) {
    return this.model.countDocuments(filter).exec();
  }

  update(id: string, data: UpdateQuery<Product>) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });
  }
}
