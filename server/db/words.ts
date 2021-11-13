import { PrismaClient } from '.prisma/client'
import { SentPair, WordId } from '../types'
import { toSentPair } from './transformType'
import { CreateSentPair } from './types'

const prisma = new PrismaClient()

export async function wordExists(wordId: number): Promise<boolean> {
  const word = await prisma.word.findUnique({
    where: {
      id: wordId,
    }
  })
  return word !== null
}

export async function getSentPairs(wordId: WordId): Promise<SentPair[] | null> {
  const word = await prisma.word.findUnique({
    where: {
      id: wordId,
    },
    include: {
      sentPairs: true,
    }
  })

  if (word) {
    const dbSentPairs =  word.sentPairs
    const sentPairs = dbSentPairs.map(toSentPair)
    return sentPairs
  } else {
    return null
  }
}

export async function setSentPairs(wordId: WordId, sentPairs: CreateSentPair[]): Promise<void> {
  const deleteSentPairs = prisma.sentPair.deleteMany({
    where: {
      wordId,
    }
  })

  const createSentPairs = prisma.word.update({
    where: {
      id: wordId,
    },
    data: {
      sentPairs: {
        create: sentPairs,
      }
    }
  })

  await prisma.$transaction([deleteSentPairs, createSentPairs])
}