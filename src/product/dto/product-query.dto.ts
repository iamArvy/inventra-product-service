import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto';
import { Types } from 'mongoose';

export enum ProductSortBy {
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
  SKU = 'sku',
  DATE = 'createdAt',
}

export class ProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ProductSortBy, description: 'Field to sort by' })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sb: ProductSortBy;

  @ApiPropertyOptional({ description: 'Name of the product' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'SKU of the product' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'ID of the store' })
  @IsOptional()
  @IsString()
  @IsUUID()
  sid?: string;

  @ApiPropertyOptional({ type: String, description: 'ID of the category' })
  @IsOptional()
  @IsMongoId()
  cid?: Types.ObjectId;

  @ApiPropertyOptional({ description: 'Minimum price of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999998)
  @Type(() => Number)
  minP?: number;

  @ApiPropertyOptional({ description: 'Maximum price of the product' })
  @IsOptional()
  @IsNumber()
  @Max(9999999999)
  @Min(1)
  @Type(() => Number)
  maxP?: number;

  @ApiPropertyOptional({ description: 'Minimum stock of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minS?: number;

  @ApiPropertyOptional({ description: 'Maximum stock of the product' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxS?: number;

  @ApiPropertyOptional({
    type: [String],
    description: 'Tags associated with the product',
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter deleted products',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  deleted?: boolean;
}
