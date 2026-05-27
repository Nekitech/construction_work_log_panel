import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class WorkTypesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.workType.findMany({ orderBy: { name: 'asc' } })
  }
}
