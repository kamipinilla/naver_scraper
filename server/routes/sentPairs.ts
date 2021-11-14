import express from 'express'
import { deleteSentPair, sentPairExists } from '../db/sentPairs'
import { RestError, RestSuccess } from './types'

const router = express.Router()

router.delete('/:sentPairId', async (req, res) => {
  const sentPairId = parseInt(req.params.sentPairId)
  if (await sentPairExists(sentPairId)) {
    await deleteSentPair(sentPairId)
    res.json({ message: `Sent pair deleted: id=${sentPairId}` } as RestSuccess)
  } else {
    res.status(400).json({ message: `Sent pair not found: id=${sentPairId}` } as RestError)
  }
})

export default router