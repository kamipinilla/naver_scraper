import { SentPair as DbSentPair } from '.prisma/client'
import { SentPair } from '../types'

export function toSentPair(dbSentPair: DbSentPair): SentPair {
  return {
    id: dbSentPair.id,
    targetSent: dbSentPair.targetSent,
    sourceSent: dbSentPair.sourceSent,
  }
}