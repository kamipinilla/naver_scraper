import express from 'express'
import hello from './hello'

const router = express.Router()
router.use('/hello', hello)

router.all('*', (req, res) => {
  const errorMsg = 'Invalid API URL: ' + req.url
  console.log(errorMsg)
  res.status(404).json({ err: errorMsg })
})

export default router