import { Controller, Logger } from '@nestjs/common';
import { ProductRepository } from 'src/product/repository';
import { CategoryRepository } from 'src/category/repository';

@Controller()
export class HandlerService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
  ) {}
  private logger: Logger = new Logger(this.constructor.name);
  /**
   * Handles stock update event
   * @param id - The id of the product being updated.
   * @param stock - The new stock value of the product.
   */
  async handleStockUpdate(id: string, stock: number) {
    const product = await this.productRepo.findByIdOrThrow(id);
    product.stock = stock;
    await product.save();
  }

  /**
   * Handles the store data deletion
   * @param id - The id of hte store being deleted
   */
  async handleStoreDeleted(id: string) {
    await this.productRepo.deleteMany({ storeId: id });
    this.logger.log(`Products for store ${id} successfully deleted`);

    await this.categoryRepo.deleteMany({ storeId: id });
    this.logger.log(`Categories for store ${id} successfully deleted`);
  }
}
