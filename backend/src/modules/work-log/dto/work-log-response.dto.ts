import { ApiProperty } from '@nestjs/swagger'
import { WorkTypeResponseDto } from '../../work-types/dto/work-type-response.dto'

export class WorkLogResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  date: string

  @ApiProperty()
  workTypeId: number

  @ApiProperty({ type: () => WorkTypeResponseDto })
  workType: WorkTypeResponseDto

  @ApiProperty()
  volume: number

  @ApiProperty()
  executorName: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string
}
