import { faker } from '@faker-js/faker/.';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the store',
    example: faker.string.uuid(),
  })
  @IsUUID()
  storeId: string;
  store_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Description of the category',
    example: 'All electronic items including phones, laptops, and accessories.',
    required: true,
  })
  description: string;

  @IsString()
  @ApiProperty({
    description: 'Image URL for the category',
    example: 'https://example.com/images/electronics.jpg',
    required: false,
  })
  image?: string;
}
