import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { CreateWorkLogDto } from './dto/create-work-log.dto'
import { PaginatedWorkLogResponseDto } from './dto/paginated-work-log-response.dto'
import { UpdateWorkLogDto } from './dto/update-work-log.dto'
import { WorkLogQueryDto } from './dto/work-log-query.dto'
import { WorkLogResponseDto } from './dto/work-log-response.dto'
import { WorkLogService } from './work-log.service'

@ApiTags('work-logs')
@Controller('work-logs')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedWorkLogResponseDto })
  findAll(@Query() query: WorkLogQueryDto) {
    return this.workLogService.findAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: WorkLogResponseDto })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workLogService.findOne(id)
  }

  @Post()
  @ApiCreatedResponse({ type: WorkLogResponseDto })
  @ApiBadRequestResponse()
  create(@Body() dto: CreateWorkLogDto) {
    return this.workLogService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: WorkLogResponseDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkLogDto,
  ) {
    return this.workLogService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.workLogService.remove(id)
  }
}
