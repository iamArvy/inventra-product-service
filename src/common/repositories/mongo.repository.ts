import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  Types,
  UpdateQuery,
  DeleteResult,
} from 'mongoose';

export abstract class MongoRepository<TDocument, TEntity> {
  protected constructor(protected readonly model: PaginateModel<TDocument>) {}

  protected validateId(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }

  create(data: TEntity) {
    return this.model.create(data);
  }

  findById(id: string) {
    this.validateId(id);
    return this.model.findById(id).exec();
  }

  findByIdOrThrow(id: string) {
    this.validateId(id);
    return this.model
      .findById(id)
      .orFail(new NotFoundException(`${this.model.modelName} not found`))
      .exec();
  }

  findByIdWithRelationships(id: string, relationships: string[]) {
    this.validateId(id);
    return this.model
      .findById(id)
      .populate(relationships)
      .orFail(new NotFoundException(`${this.model.modelName} not found`))
      .exec();
  }

  list(filter: FilterQuery<TEntity>, options: PaginateOptions) {
    return this.model.paginate(this.model.find(filter), options);
  }

  count(filter: FilterQuery<TEntity>) {
    return this.model.countDocuments(filter).exec();
  }

  update(id: string, data: UpdateQuery<TDocument>) {
    this.validateId(id);
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  softDelete(id: string) {
    this.validateId(id);
    return this.model
      .findByIdAndUpdate(id, {
        deletedAt: new Date(),
      })
      .exec();
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }

  deleteMany(filter: FilterQuery<TEntity>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }
}
