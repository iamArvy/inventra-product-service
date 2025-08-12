import { PaginatedDto } from 'src/common/dto';
import { CategoryDto } from './category.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedCategoryDto extends PaginatedDto<CategoryDto> {
  @ApiProperty({ type: [CategoryDto] })
  declare docs: CategoryDto[];
}
