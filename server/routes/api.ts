import express from 'express'
import htmlContent from './htmlContent'
import words from './words'
import sentPairs from './sentPairs'

const router = express.Router()
router.use('/htmlContent', htmlContent)
router.use('/words', words)
router.use('/sentPairs', sentPairs)


router.all('*', (req, res) => {
  const errorMsg = 'Invalid API URL: ' + req.url
  console.log(errorMsg)
  res.status(404).json({ err: errorMsg })
})

export default router