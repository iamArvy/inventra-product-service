import { IdInput } from 'common/dto';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductDto,
  ProductQueryDto,
} from './dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { runRpcMethod } from 'src/common/helpers/run-rpc-method';
import { Status } from 'src/common/dto/app.response';
import { PaginateResult } from 'mongoose';

@Controller('products')
export class ProductGrpcController {
  constructor(private readonly service: ProductService) {}

  @GrpcMethod('ProductService')
  create({ storeId, data }: CreateProductInput) {
    return runRpcMethod<ProductDto>(this.service.create(storeId, data));
  }

  @GrpcMethod('ProductService')
  get({ id }: IdInput) {
    return runRpcMethod<ProductDto>(this.service.get(id), 'product');
  }

  @GrpcMethod('ProductService')
  list(query: ProductQueryDto) {
    return runRpcMethod<PaginateResult<ProductDto>>(
      this.service.list(query),
      'products',
    );
  }

  @GrpcMethod('ProductService')
  update({ id, data }: UpdateProductInput) {
    return runRpcMethod<Status>(this.service.update(id, data), 'status');
  }

  @GrpcMethod('ProductService')
  delete({ id }: IdInput) {
    return runRpcMethod<Status>(this.service.delete(id), 'status');
  }
}
