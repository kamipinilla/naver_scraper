import { PrismaClient } from '.prisma/client'
import { SentPair, Word, WordId } from '../types'
import { toSentPair, toWord } from './transformType'
import { NewSentPair } from './types'

const prisma = new PrismaClient()

export async function getWord(wordId: WordId): Promise<Word> {
  const dbWord = await prisma.word.findUnique({
    where: {
      id: wordId,
    }
  })

  if (dbWord) {
    const word = toWord(dbWord)
    return word
  } else {
    throw Error(wordNotFoundErrorMessage(wordId))
  }
}

export async function getWords(): Promise<Word[]> {
  const dbWords = await prisma.word.findMany()
  const words = dbWords.map(toWord)
  return words
}

export async function wordExists(wordId: number): Promise<boolean> {
  const dbWord = await prisma.word.findUnique({
    where: {
      id: wordId,
    }
  })
  return dbWord !== null
}

export async function getSentPairs(wordId: WordId): Promise<SentPair[]> {
  if (!await wordExists(wordId)) {
    throw Error(wordNotFoundErrorMessage(wordId))
  }

  const dbSentPairs = await prisma.sentPair.findMany({
    where: {
      wordId,
    }
  })
  const sentPairs = dbSentPairs.map(toSentPair)
  return sentPairs
}

export async function addSentPair(wordId: WordId, newSentPair: NewSentPair): Promise<void> {
  if (!wordExists(wordId)) {
    throw Error(wordNotFoundErrorMessage(wordId))
  }

  await prisma.word.update({
    where: {
      id: wordId,
    },
    data: {
      sentPairs: {
        create: newSentPair,
      }
    }
  })
}

function wordNotFoundErrorMessage(wordId: number): string {
  return `Word not found: id=${wordId}`
}