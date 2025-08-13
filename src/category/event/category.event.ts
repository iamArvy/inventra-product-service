import { Injectable } from '@nestjs/common';
import { RabbitmqService } from 'src/messaging/rabbitmq.service';
import { CategoryEvents } from './category.keys';
import { CategoryDto } from 'src/category/dto';

@Injectable()
export class CategoryEvent {
  constructor(private readonly rmq: RabbitmqService) {}
  created(data: CategoryDto) {
    this.rmq.emit(CategoryEvents.CATEGORY_CREATED, data);
  }

  updated(id: string, data: Partial<CategoryDto>) {
    this.rmq.emit(CategoryEvents.CATEGORY_UPDATED, { id, data });
  }

  deleted(id: string) {
    this.rmq.emit(CategoryEvents.CATEGORY_DELETED, { id });
  }
}
