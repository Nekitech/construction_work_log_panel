import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator'

export class CreateWorkLogDto {
  @ApiProperty({ example: '2024-05-15', description: 'ISO date string (YYYY-MM-DD)' })
  @IsDateString()
  date: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  workTypeId: number

  @ApiProperty({ example: 24.5 })
  @IsNumber()
  @IsPositive()
  volume: number

  @ApiProperty({ example: 'Иванов Иван Иванович' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  executorName: string
}
