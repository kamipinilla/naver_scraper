import express from 'express'
import { getHtmlContent } from '../db/htmlUpdates'
import { RestError } from '../types'
const router = express.Router()

router.get('/', async (req, res) => {
  const content = await getHtmlContent()
  if (content) {
    console.log('html sent')
    res.json({
      content
    })
  } else {
    const errorMsg = 'There are no html updates'
    console.error(errorMsg)
    res.status(400).json({ err: errorMsg } as RestError)
  }
})

export default router