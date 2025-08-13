import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PaginateResult } from 'mongoose';
// Allowed sort orders for number fields
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDto {
  @ApiPropertyOptional({ type: Number, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

export class PaginatedDto<T> implements PaginateResult<T> {
  @ApiProperty({ type: [Object] })
  docs: T[];

  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  pagingCounter: number;

  @ApiProperty()
  hasPrevPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty({ nullable: true })
  prevPage?: number | null;

  @ApiProperty({ nullable: true })
  nextPage?: number | null;

  @ApiProperty({ nullable: true })
  offset: number;

  [customLabel: string]: any; // this is the index signature
}
