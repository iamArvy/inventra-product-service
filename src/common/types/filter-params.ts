import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterParams {
  @ApiPropertyOptional({
    type: 'object',
    description: 'Filter conditions for the query',
    additionalProperties: true,
  })
  where?: Record<string, any>;

  @ApiPropertyOptional({
    type: 'object',
    description: 'Sorting order (1 for ASC, -1 for DESC)',
    additionalProperties: {
      type: 'integer',
      enum: [1, -1],
    },
  })
  orderBy?: Record<string, 1 | -1>;

  @ApiPropertyOptional({ type: Number })
  skip?: number;

  @ApiPropertyOptional({ type: Number })
  take?: number;
}
