import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { PaginatedDto } from 'src/common/dto';

export class PaginatedProductDto extends PaginatedDto<ProductDto> {
  @ApiProperty({ type: [ProductDto] })
  declare docs: ProductDto[];
}
