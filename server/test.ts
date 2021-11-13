import { PrismaClient } from '@prisma/client'
import { CreateSentPair } from './db/types'
import { setSentPairs } from './db/words'

const prisma = new PrismaClient()

async function clear() {
  await prisma.word.deleteMany({})
}

async function testSentPairs() {
  const sentPairs: CreateSentPair[] = [
    // {
    //   targetSent: 't5',
    //   sourceSent: 's5',
    // },
    // {
    //   targetSent: 't6',
    //   sourceSent: 's6',
    // }
  ]

  await setSentPairs(3, sentPairs)
}

async function main() {
  // await clear()
  await testSentPairs()
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
