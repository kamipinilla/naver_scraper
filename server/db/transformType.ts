import { Word as DbWord, SentPair as DbSentPair } from '.prisma/client'
import { SentPair, Word } from '../types'

export function toWord(dbWord: DbWord): Word {
  return {
    id: dbWord.id,
    name: dbWord.name,
  }
}

export function toSentPair(dbSentPair: DbSentPair): SentPair {
  return {
    id: dbSentPair.id,
    targetSent: dbSentPair.targetSent,
    sourceSent: dbSentPair.sourceSent,

    origTargetSent: dbSentPair.origTargetSent,
    origSourceSent: dbSentPair.origSourceSent,
  }
}