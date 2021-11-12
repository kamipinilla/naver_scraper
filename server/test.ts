import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clear() {
  await prisma.word.deleteMany({})
}

async function main() {
  // await clear()
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
