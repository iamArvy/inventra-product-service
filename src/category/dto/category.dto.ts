import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CategoryDocument } from 'src/category/category.schema';
export class CategoryDto {
  @Expose()
  @Transform(({ obj }: { obj: CategoryDocument }) => obj._id.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  image?: string;

  @IsNotEmpty()
  @Expose()
  @IsString()
  store_id: string;

  @Expose()
  created_at: Date;

  static from(data: CategoryDocument): CategoryDto {
    return plainToInstance(CategoryDto, data, {
      excludeExtraneousValues: true,
    });
  }

  static fromMany(data: CategoryDocument[]): CategoryDto[] {
    return plainToInstance(CategoryDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
