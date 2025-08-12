import { Module } from '@nestjs/common';
import { ProductGrpcController } from './product.grpc.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { Product, ProductSchema } from './product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductHttpController } from './product.http.controller';
import { CategoryRepository } from 'src/category/category.repository';
import { Category, CategorySchema } from 'src/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ProductGrpcController, ProductHttpController],
  providers: [ProductService, ProductRepository, CategoryRepository],
})
export class ProductModule {}
