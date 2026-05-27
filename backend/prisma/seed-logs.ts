import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const executors = [
  'Иванов А.В.',
  'Петров С.Н.',
  'Сидоров К.Д.',
  'Козлов Р.И.',
  'Новиков М.Е.',
  'Морозов Д.А.',
  'Волков П.С.',
  'Лебедев Г.Ю.',
]

const volumeRange: Record<string, [number, number]> = {
  'м²': [10, 120],
  'м³': [2, 30],
  'т': [0.5, 8],
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1))
}

function randomDate(daysBack: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - randInt(0, daysBack))
  d.setHours(0, 0, 0, 0)
  return d
}

async function main() {
  const existing = await prisma.workLog.count()
  if (existing > 0) {
    console.log(`Work logs already seeded (${existing} records), skipping`)
    return
  }

  const workTypes = await prisma.workType.findMany()
  if (workTypes.length === 0) {
    console.error('No work types found — run the main seed first')
    process.exit(1)
  }

  const COUNT = 40

  const records = Array.from({ length: COUNT }, () => {
    const wt = workTypes[randInt(0, workTypes.length - 1)]
    const [min, max] = volumeRange[wt.unit] ?? [1, 50]
    const volume = Math.round(rand(min, max) * 10) / 10

    return {
      date: randomDate(90),
      workTypeId: wt.id,
      volume,
      executorName: executors[randInt(0, executors.length - 1)],
    }
  })

  await prisma.workLog.createMany({ data: records })
  console.log(`Seeded ${COUNT} work log entries`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
