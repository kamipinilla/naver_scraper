import { PrismaClient } from '.prisma/client'
import { SentPair, SentPairId } from '../types'
import { toSentPair } from './transformType'
import { UpdateSentPair } from './types'

const prisma = new PrismaClient()

export async function sentPairExists(sentPairId: SentPairId): Promise<boolean> {
  const dbSentPair = prisma.sentPair.findUnique({
    where: {
      id: sentPairId,
    }
  })
  return dbSentPair !== null
}

async function getSentPair(sentPairId: SentPairId): Promise<SentPair> {
  const dbSentPair = await prisma.sentPair.findUnique({
    where: {
      id: sentPairId,
    }
  })

  if (dbSentPair !== null) {
    return toSentPair(dbSentPair)
  } else {
    throw Error(sentPairNotFound(sentPairId))
  }
}

export async function updateSentPair(sentPairId: SentPairId, update: UpdateSentPair): Promise<void> {
  if (update.targetSent !== undefined) {
    await setTargetSent(sentPairId, update.targetSent)
  }
  if (update.sourceSent !== undefined) {
    await setSourceSent(sentPairId, update.sourceSent)
  }
}

async function setTargetSent(sentPairId: SentPairId, newTargetSent: string): Promise<void> {
  if (!sentPairExists(sentPairId)) {
    throw Error(sentPairNotFound(sentPairId))
  }

  if (newTargetSent === '') {
    throw Error('Target sentence cannot be empty')
  }

  const sentPair = await getSentPair(sentPairId)
  if (sentPair.targetSent === newTargetSent) {
    return
  }

  const transaction = []

  if (sentPair.origTargetSent === null) {
    const setOrigTargetSent = prisma.sentPair.update({
      where: {
        id: sentPairId,
      },
      data: {
        origTargetSent: sentPair.targetSent
      }
    })

    transaction.push(setOrigTargetSent)
  } else {
    if (newTargetSent === sentPair.origTargetSent) {
      const clearOrigTargetSent = prisma.sentPair.update({
        where: {
          id: sentPairId,
        },
        data: {
          origTargetSent: null
        }
      })

      transaction.push(clearOrigTargetSent)
    }
  }

  const updateTargetSent = prisma.sentPair.update({
    where: {
      id: sentPairId,
    },
    data: {
      targetSent: newTargetSent,
    }
  })

  transaction.push(updateTargetSent)

  await prisma.$transaction(transaction)
}

async function setSourceSent(sentPairId: SentPairId, newSourceSent: string): Promise<void> {
  if (!sentPairExists(sentPairId)) {
    throw Error(sentPairNotFound(sentPairId))
  }

  if (newSourceSent === '') {
    throw Error('Source sentence cannot be empty')
  }

  const sentPair = await getSentPair(sentPairId)
  if (sentPair.sourceSent === newSourceSent) {
    return
  }

  const transaction = []

  if (sentPair.origSourceSent === null) {
    const setOrigSourceSent = prisma.sentPair.update({
      where: {
        id: sentPairId,
      },
      data: {
        origSourceSent: sentPair.sourceSent,
      }
    })

    transaction.push(setOrigSourceSent)
  } else {
    if (newSourceSent === sentPair.origSourceSent) {
      const clearOrigSourceSent = prisma.sentPair.update({
        where: {
          id: sentPairId,
        },
        data: {
          origSourceSent: null,
        }
      })

      transaction.push(clearOrigSourceSent)
    }
  }

  const updateSourceSent = prisma.sentPair.update({
    where: {
      id: sentPairId,
    },
    data: {
      sourceSent: newSourceSent,
    }
  })

  transaction.push(updateSourceSent)

  await prisma.$transaction(transaction)
}
export async function deleteSentPair(sentPairId: SentPairId): Promise<void> {
  if (!sentPairExists(sentPairId)) {
    throw Error(sentPairNotFound(sentPairId))
  }
  
  await prisma.sentPair.delete({
    where: {
      id: sentPairId,
    }
  })
}

function sentPairNotFound(sentPairId: SentPairId): string {
  return `Sent pair not found: id=${sentPairId}`
}