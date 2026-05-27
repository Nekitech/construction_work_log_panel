import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class WorkLogQueryDto {
  @ApiPropertyOptional({ example: '2024-01-01', description: 'Filter from date (inclusive)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string

  @ApiPropertyOptional({ example: '2024-12-31', description: 'Filter to date (inclusive)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string

  @ApiPropertyOptional({ example: 'Иванов', description: 'Filter by executor name (case-insensitive partial match)' })
  @IsOptional()
  @IsString()
  executorName?: string

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc'

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number
}
