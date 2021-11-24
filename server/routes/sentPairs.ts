import express from 'express'
import { deleteSentPair, sentPairExists, updateSentPair } from '../db/sentPairs'
import { UpdateSentPair } from '../db/types'
import { SentPairId } from '../types'
import { RestError, RestSuccess } from './types'

const router = express.Router()

router.delete('/:sentPairId', async (req, res) => {
  const sentPairId = parseInt(req.params.sentPairId)
  if (await sentPairExists(sentPairId)) {
    await deleteSentPair(sentPairId)
    res.json({ message: `Sent pair deleted: id=${sentPairId}` } as RestSuccess)
  } else {
    res.status(400).json({ message: sentPairNotFound(sentPairId) } as RestError)
  }
})

router.put('/:sentPairId', async (req, res) => {
  const sentPairId = parseInt(req.params.sentPairId)
  if (await sentPairExists(sentPairId)) {
    const sentPairUpdate: UpdateSentPair = req.body
    await updateSentPair(sentPairId, sentPairUpdate)
    res.json({ message: `Sent pair updated: id=${sentPairId}` } as RestSuccess)
  }  else {
    res.status(400).json({ message: sentPairNotFound(sentPairId) } as RestError)
  }
})

function sentPairNotFound(sentPairId: SentPairId): string {
  return `Sent pair not found: id=${sentPairId}`
}

export default router