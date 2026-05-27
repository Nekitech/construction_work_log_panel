import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const workTypes = [
  { name: 'Кладка перегородок', unit: 'м²' },
  { name: 'Монтаж опалубки', unit: 'м²' },
  { name: 'Бетонирование', unit: 'м³' },
  { name: 'Армирование', unit: 'т' },
  { name: 'Штукатурка стен', unit: 'м²' },
  { name: 'Монтаж кровли', unit: 'м²' },
  { name: 'Устройство стяжки', unit: 'м²' },
]

async function main() {
  const existingCount = await prisma.workType.count()
  if (existingCount === 0) {
    await prisma.workType.createMany({ data: workTypes })
    console.log(`Seeded ${workTypes.length} work types`)
  }
  else {
    console.log(`Seed skipped: ${existingCount} work types already exist`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
