import express from 'express'
import htmlContent from './htmlContent'

const router = express.Router()
router.use('/htmlContent', htmlContent)

router.all('*', (req, res) => {
  const errorMsg = 'Invalid API URL: ' + req.url
  console.log(errorMsg)
  res.status(404).json({ err: errorMsg })
})

export default router