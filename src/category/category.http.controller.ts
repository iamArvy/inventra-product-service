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
import { CategoryService } from './category.service';
import {
  CategoryDto,
  CategoryQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('categories')
export class CategoryHttpController {
  constructor(private readonly service: CategoryService) {}

  @ApiOkResponse({
    description: 'New category created',
    type: CategoryDto,
  })
  @Put('create')
  create(@Body() data: CreateCategoryDto) {
    return this.service.create(data);
  }

  @Get('get/:id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get('list')
  list(@Query() query: CategoryQueryDto) {
    return this.service.list(query);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.service.update(id, data);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
