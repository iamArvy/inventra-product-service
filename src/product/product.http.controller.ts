import {
  UpdateProductDto,
  CreateProductDto,
  ProductDto,
  CreateProductInput,
  ProductQueryDto,
} from './dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Product')
@Controller('products')
export class ProductHttpController {
  constructor(private readonly service: ProductService) {}

  @ApiOkResponse({
    description: 'Create a new product',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiBody({
    type: CreateProductInput,
    description: 'Product data to create',
  })
  @Put('create')
  create(
    @Body('storeId') id: string,
    @Body('data') data: CreateProductDto,
  ): Promise<ProductDto> {
    return this.service.create(id, data);
  }

  @ApiOkResponse({
    description: 'Create a new product',
    type: ProductDto,
  })
  @Get('get/:id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get('list')
  list(@Query() query: ProductQueryDto) {
    return this.service.list(query);
  }

  @Patch('update')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.update(id, data);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
