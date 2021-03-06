import express from 'express'
import { getHtmlContent } from '../middle_db/htmlContent'
import { RestError } from './types'
const router = express.Router()

router.get('/', async (req, res) => {
  const content = await getHtmlContent()
  if (content) {
    res.json({
      content
    })
  } else {
    const errorMsg = 'There are no HTML updates'
    console.error(errorMsg)
    res.status(400).json({ message: errorMsg } as RestError)
  }
})

export default router