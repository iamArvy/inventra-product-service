import { CategoriesSeeder } from './category/category.seeder';
import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product/schema';
import { ProductsSeeder } from './product/product.seeder';
import { Category, CategorySchema } from './category/schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRoot('mongodb://localhost/nestjs-seeder-sample'),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || 'mongodb://localhost/nest',
      }),
    }),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
}).run([CategoriesSeeder, ProductsSeeder]);
