import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Category,
  CategoryDocument,
} from 'src/category/schema/category.schema';
import { FilterQuery, PaginateModel, PaginateOptions, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCategoryDto } from '../dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name) private model: PaginateModel<CategoryDocument>,
  ) {}

  create(data: Category) {
    return this.model.create(data);
  }

  findById(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Category ID format');
    }

    return this.model.findById(id).exec();
  }

  async findByIdOrThrow(id: string | Types.ObjectId) {
    return this.model
      .findById(id)
      .orFail(new NotFoundException('Category not found'))
      .exec();
  }

  findByName(store_id: string, name: string) {
    return this.model
      .findOne({
        store_id,
        name,
      })
      .exec();
  }

  findByNameOrThrow(store_id: string, name: string) {
    return this.model
      .findOne({
        store_id,
        name,
      })
      .orFail(new NotFoundException('Category not found'))
      .exec();
  }

  list(filter: FilterQuery<Category>, options: PaginateOptions) {
    return this.model.paginate(this.model.find(filter), options);
  }

  update(id: string, data: UpdateCategoryDto) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }
}
