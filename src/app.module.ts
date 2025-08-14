import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from 'category/category.module';
import { ProductModule } from 'product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RMQModule } from './rmq/rmq.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || 'mongodb://localhost/nest',
      }),
    }),
    CategoryModule,
    ProductModule,
    RMQModule,
  ],
})
export class AppModule {}
