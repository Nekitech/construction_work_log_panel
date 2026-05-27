import { ApiProperty } from '@nestjs/swagger'
import { WorkLogResponseDto } from './work-log-response.dto'

export class PaginatedWorkLogResponseDto {
  @ApiProperty({ type: [WorkLogResponseDto] })
  data: WorkLogResponseDto[]

  @ApiProperty()
  total: number

  @ApiProperty()
  page: number

  @ApiProperty()
  limit: number

  @ApiProperty()
  totalPages: number
}
