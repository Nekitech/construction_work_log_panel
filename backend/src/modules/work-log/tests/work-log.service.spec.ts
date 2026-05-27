import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '../../../common/prisma/prisma.service'
import { WorkLogService } from '../work-log.service'

const workType = { id: 1, name: 'Бетонирование', unit: 'м³' }

const workLog = {
  id: 1,
  date: new Date('2024-06-01'),
  workTypeId: 1,
  workType,
  volume: 12.5,
  executorName: 'Иванов А.В.',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const prismaMock = {
  workLog: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
}

describe('WorkLogService', () => {
  let service: WorkLogService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkLogService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile()

    service = module.get(WorkLogService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('returns paginated result with defaults', async () => {

      prismaMock.$transaction.mockResolvedValue([[workLog], 1])

      const result = await service.findAll({})

      expect(result).toEqual({ data: [workLog], total: 1, page: 1, limit: 10, totalPages: 1 })
    })

    it('applies date range filter', async () => {

      prismaMock.$transaction.mockResolvedValue([[], 0])

      await service.findAll({ dateFrom: '2024-01-01', dateTo: '2024-12-31' })

      expect(prismaMock.workLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { date: { gte: new Date('2024-01-01'), lte: new Date('2024-12-31') } },
        }),
      )
    })

    it('calculates totalPages correctly', async () => {

      prismaMock.$transaction.mockResolvedValue([[], 25])

      const result = await service.findAll({ page: 1, limit: 10 })

      expect(result.totalPages).toBe(3)
    })
  })

  describe('findOne', () => {
    it('returns the entry when found', async () => {

      prismaMock.workLog.findUnique.mockResolvedValue(workLog)

      const result = await service.findOne(1)

      expect(result).toEqual(workLog)
      expect(prismaMock.workLog.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { workType: true },
      })
    })

    it('throws NotFoundException when entry does not exist', async () => {

      prismaMock.workLog.findUnique.mockResolvedValue(null)

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('creates and returns a new work log entry', async () => {

      prismaMock.workLog.create.mockResolvedValue(workLog)
      const dto = { date: '2024-06-01', workTypeId: 1, volume: 12.5, executorName: 'Иванов А.В.' }

      const result = await service.create(dto)

      expect(result).toEqual(workLog)
      expect(prismaMock.workLog.create).toHaveBeenCalledWith({
        data: { date: new Date('2024-06-01'), workTypeId: 1, volume: 12.5, executorName: 'Иванов А.В.' },
        include: { workType: true },
      })
    })
  })

  describe('update', () => {
    it('updates and returns the entry', async () => {

      const updated = { ...workLog, volume: 20 }
      prismaMock.workLog.findUnique.mockResolvedValue(workLog)
      prismaMock.workLog.update.mockResolvedValue(updated)

      const result = await service.update(1, { volume: 20 })

      expect(result).toEqual(updated)
      expect(prismaMock.workLog.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { volume: 20 },
        include: { workType: true },
      })
    })

    it('converts date string to Date object when date is provided', async () => {

      prismaMock.workLog.findUnique.mockResolvedValue(workLog)
      prismaMock.workLog.update.mockResolvedValue(workLog)

      await service.update(1, { date: '2024-09-15' })

      expect(prismaMock.workLog.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ date: new Date('2024-09-15') }) }),
      )
    })

    it('throws NotFoundException when entry does not exist', async () => {

      prismaMock.workLog.findUnique.mockResolvedValue(null)

      await expect(service.update(99, { volume: 5 })).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('deletes the entry', async () => {

      prismaMock.workLog.findUnique.mockResolvedValue(workLog)
      prismaMock.workLog.delete.mockResolvedValue(workLog)

      await service.remove(1)

      expect(prismaMock.workLog.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('throws NotFoundException when entry does not exist', async () => {

      prismaMock.workLog.findUnique.mockResolvedValue(null)

      await expect(service.remove(99)).rejects.toThrow(NotFoundException)
    })
  })
})
