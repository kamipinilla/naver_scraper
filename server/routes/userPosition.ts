import express from 'express'
import { getUserPosition, setUserPosition } from '../db/userPosition'
import { RestError, RestSuccess } from './types'

const router = express.Router()

router.get('/', (_, res) => {
  const userPosition = getUserPosition()
  const userPositionStr = userPosition.toString()
  res.send(userPositionStr)
})

router.put('/', (req, res) => {
  const userPositionParam = 'value'
  const userPositionStr = req.query[userPositionParam]
  if (userPositionStr === undefined) {
    res.status(400).json({ message: `"${userPositionParam}" param not found` } as RestError)
  }

  const userPosition = parseInt(userPositionStr as string)
  setUserPosition(userPosition)
  res.json({ message: 'User position updated' } as RestSuccess)
})

export default router
