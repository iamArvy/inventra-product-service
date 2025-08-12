import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { FilterQuery, PaginateModel, UpdateQuery } from 'mongoose';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private model: PaginateModel<ProductDocument>,
  ) {}

  create(data: Product) {
    return this.model.create(data);
  }

  findById(id: string) {
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
    return this.model
      .findById(id)
      .orFail(new NotFoundException('Product not found'))
      .exec();
  }

  findByIdWithRelationships(
    id: string,
    relationships: string[],
  ): Promise<Product> {
    return this.model
      .findById(id)
      .populate(relationships)
      .orFail(new NotFoundException('Product not found'))
      .exec();
  }

  list(filter: FilterQuery<Product>, options: any) {
    return this.model.paginate(this.model.find(filter), options);
  }

  update(id: string, data: UpdateQuery<Product>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    return this.model.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });
  }
}
