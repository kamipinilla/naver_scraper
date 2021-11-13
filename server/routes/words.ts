import express from 'express'
import { CreateSentPair } from '../db/types'
import { getSentPairs, setSentPairs, wordExists } from '../db/words'
import { RestError, RestItems, RestSuccess } from './types'

const router = express.Router()

router.get('/:wordId/sentPairs', async (req, res) => {
  const wordId = parseInt(req.params.wordId)
  if (await wordExists(wordId)) {
    const sentPairs = await getSentPairs(wordId)
    res.json({ items: sentPairs } as RestItems)
  } else {
    res.status(400).json({ message: notFoundErrorMessage(wordId) } as RestError)
  }
})

router.put('/:wordId/sentPairs', async (req, res) => {
  const wordId = parseInt(req.params.wordId)
  if (await wordExists(wordId)) {
    const sentPairs: CreateSentPair[] = (req.body as RestItems).items
    await setSentPairs(wordId, sentPairs)
    res.json({ message: 'SentPairs updated' } as RestSuccess)
  } else {
    res.status(400).json({ message: notFoundErrorMessage(wordId) } as RestError)
  }
})

function notFoundErrorMessage(wordId: number): string {
  return `Word not found: id=${wordId}`
}

export default router