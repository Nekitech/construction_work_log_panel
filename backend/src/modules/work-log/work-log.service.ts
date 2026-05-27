import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateWorkLogDto } from './dto/create-work-log.dto'
import { UpdateWorkLogDto } from './dto/update-work-log.dto'
import { WorkLogQueryDto } from './dto/work-log-query.dto'

const include = { workType: true } as const

@Injectable()
export class WorkLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: WorkLogQueryDto) {
    const { dateFrom, dateTo, executorName, sortOrder = 'desc', page = 1, limit = 10 } = query
    const where = {
      date: {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      },
      ...(executorName ? { executorName: { contains: executorName, mode: 'insensitive' as const } } : {}),
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.workLog.findMany({
        where,
        include,
        orderBy: { date: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.workLog.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: number) {
    const entry = await this.prisma.workLog.findUnique({ where: { id }, include })
    if (!entry) throw new NotFoundException(`Work log #${id} not found`)
    return entry
  }

  create(dto: CreateWorkLogDto) {
    const { date, workTypeId, volume, executorName } = dto
    return this.prisma.workLog.create({
      data: { date: new Date(date), workTypeId, volume, executorName },
      include,
    })
  }

  async update(id: number, dto: UpdateWorkLogDto) {
    await this.findOne(id)
    const { date, ...rest } = dto
    return this.prisma.workLog.update({
      where: { id },
      data: { ...(date ? { date: new Date(date) } : {}), ...rest },
      include,
    })
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.workLog.delete({ where: { id } })
  }
}
