import { Module } from '@nestjs/common';
import { CategoryGrpcController } from './category.grpc.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { Category, CategorySchema } from './category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryHttpController } from './category.http.controller';
import { Product, ProductSchema } from 'src/product/product.schema';
import { ProductRepository } from 'src/product/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CategoryGrpcController, CategoryHttpController],
  providers: [CategoryService, CategoryRepository, ProductRepository],
})
export class CategoryModule {}
