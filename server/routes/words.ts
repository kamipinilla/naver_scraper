import express from 'express'
import { NewSentPair } from '../db/types'
import { getWords, getSentPairs, wordExists, getWord, addSentPair } from '../db/words'
import { RestError, RestItems, RestSuccess } from './types'

const router = express.Router()

router.get('/', async (req, res) => {
  const words = await getWords()
  res.json({ items: words } as RestItems)
})

router.get('/:wordId', async (req, res) => {
  const wordId = parseInt(req.params.wordId)
  if (await wordExists(wordId)) {
    const word = await getWord(wordId)
    res.json(word)
  } else {
    res.status(400).json({ message: notFoundErrorMessage(wordId) } as RestError)
  }
})

router.get('/:wordId/sentPairs', async (req, res) => {
  const wordId = parseInt(req.params.wordId)
  if (await wordExists(wordId)) {
    const sentPairs = await getSentPairs(wordId)
    res.json({ items: sentPairs } as RestItems)
  } else {
    res.status(400).json({ message: notFoundErrorMessage(wordId) } as RestError)
  }
})

router.post('/:wordId/sentPairs', async (req, res) => {
  const wordId = parseInt(req.params.wordId)
  if (await wordExists(wordId)) {
    const newSentPair: NewSentPair = req.body
    await addSentPair(wordId, newSentPair)
    res.json({ message: 'Sent pair added' } as RestSuccess)
  } else {
    res.status(400).json({ message: notFoundErrorMessage(wordId) } as RestError)
  }
})

function notFoundErrorMessage(wordId: number): string {
  return `Word not found: id=${wordId}`
}

export default router