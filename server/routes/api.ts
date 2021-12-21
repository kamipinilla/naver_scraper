import express from 'express'
import htmlContent from './htmlContent'
import words from './words'
import sentPairs from './sentPairs'
import userPosition from './userPosition'

const router = express.Router()
router.use('/htmlContent', htmlContent)
router.use('/words', words)
router.use('/sentPairs', sentPairs)
router.use('/userPosition', userPosition)

router.all('*', (req, res) => {
  const errorMsg = 'Invalid API URL: ' + req.url
  console.log(errorMsg)
  res.status(404).json({ err: errorMsg })
})

export default router