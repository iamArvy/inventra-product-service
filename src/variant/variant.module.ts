import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { VariantRepository } from './variant.repository';

@Module({
  controllers: [VariantController],
  providers: [VariantService, VariantRepository],
  exports: [VariantService],
})
export class VariantModule {}
