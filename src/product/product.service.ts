import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateProductDto,
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto';
import { ProductRepository } from 'src/product/product.repository';

@Injectable()
export class ProductService {
  constructor(private repo: ProductRepository) {}

  async get(id: string) {
    const product = await this.repo.findByIdWithRelationships(id, ['category']);
    return ProductDto.from(product);
  }

  async list(query: ProductQueryDto) {
    return await this.repo.list(query);
  }

  async create(store_id: string, data: CreateProductDto) {
    const product = await this.repo.create(store_id, data);
    if (!product) throw new InternalServerErrorException('Product Not Created');
    return ProductDto.from(product);
  }

  async update(id: string, data: UpdateProductDto) {
    await this.repo.findByIdOrThrow(id);
    await this.repo.update(id, data);
    return { success: true };
  }

  async delete(id: string) {
    const product = await this.repo.findByIdOrThrow(id);
    if (product.deletedAt) {
      throw new BadRequestException('Product already deleted');
    }
    await this.repo.delete(id);
    return { success: true };
  }
}
