import { Module } from '@nestjs/common';
import { ProductRepository } from 'src/product/repository';
import { Product, ProductSchema } from 'src/product/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryRepository } from 'src/category/repository';
import { Category, CategorySchema } from 'src/category/schema';
import { HandlerController } from './handler.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [HandlerController],
  providers: [ProductRepository, CategoryRepository],
})
export class ProductModule {}
