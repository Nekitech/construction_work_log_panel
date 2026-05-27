import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator'
import { CreateWorkLogDto } from './create-work-log.dto'

export class UpdateWorkLogDto extends PartialType(CreateWorkLogDto) {
  @ApiPropertyOptional({ example: '2024-05-15' })
  @IsOptional()
  @IsDateString()
  date?: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  workTypeId?: number

  @ApiPropertyOptional({ example: 24.5 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  volume?: number

  @ApiPropertyOptional({ example: 'Иванов Иван Иванович' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  executorName?: string
}
