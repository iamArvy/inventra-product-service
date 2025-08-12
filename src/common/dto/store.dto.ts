import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class StoreId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the store',
  })
  @IsUUID()
  storeId: string;
}
