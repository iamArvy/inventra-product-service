import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductHandlers } from './handler.keys';
import { StockUpdateDto } from './dto';
import { HandlerService } from './handler.service';

@Controller()
export class HandlerController {
  constructor(private readonly service: HandlerService) {}
  private logger: Logger = new Logger(this.constructor.name);
  /**
   * Handles stock update event
   * @param data - The data containing id and stock value for the product.
   */
  @EventPattern(ProductHandlers.PRODUCT_STOCK_UPDATE)
  async handleStockUpdate(@Payload() { id, stock }: StockUpdateDto) {
    await this.service.handleStockUpdate(id, stock);
  }

  /**
   * Handles the store data deletion
   * @param id - The id of hte store being deleted
   */
  @EventPattern(ProductHandlers.STOCK_DECREASE)
  async handleStoreDeleted(@Payload() id: string) {
    await this.handleStoreDeleted(id);
  }
}
