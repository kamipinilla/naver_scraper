import { PrismaClient } from '.prisma/client'
import { SentPairId } from '../types'

const prisma = new PrismaClient()

export async function sentPairExists(sentPairId: SentPairId): Promise<boolean> {
  const dbSentPair = prisma.sentPair.findUnique({
    where: {
      id: sentPairId,
    }
  })
  return dbSentPair !== null
}

export async function deleteSentPair(sentPairId: SentPairId): Promise<void> {
  if (!sentPairExists(sentPairId)) {
    throw Error(`Sent pair not found: id=${sentPairId}`)
  }
  
  await prisma.sentPair.delete({
    where: {
      id: sentPairId,
    }
  })
}