import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
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
  @Expose()
  docs: T[];

  @ApiProperty()
  @Expose()
  totalDocs: number;

  @ApiProperty()
  @Expose()
  limit: number;

  @ApiProperty()
  @Expose()
  page?: number;

  @ApiProperty()
  @Expose()
  totalPages: number;

  @ApiProperty()
  @Expose()
  pagingCounter: number;

  @ApiProperty()
  @Expose()
  hasPrevPage: boolean;

  @ApiProperty()
  @Expose()
  hasNextPage: boolean;

  @ApiProperty({ nullable: true })
  @Expose()
  prevPage?: number | null;

  @ApiProperty({ nullable: true })
  @Expose()
  nextPage?: number | null;

  @ApiProperty({ nullable: true })
  @Expose()
  offset: number;

  [customLabel: string]: any; // this is the index signature
}
