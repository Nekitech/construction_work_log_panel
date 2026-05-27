import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { WorkTypeResponseDto } from './dto/work-type-response.dto'
import { WorkTypesService } from './work-types.service'

@ApiTags('work-types')
@Controller('work-types')
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @Get()
  @ApiOkResponse({ type: [WorkTypeResponseDto] })
  findAll() {
    return this.workTypesService.findAll()
  }
}
