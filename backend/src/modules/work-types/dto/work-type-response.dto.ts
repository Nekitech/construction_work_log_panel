import { ApiProperty } from '@nestjs/swagger'

export class WorkTypeResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  unit: string
}
