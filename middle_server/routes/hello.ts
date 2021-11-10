import express from 'express'
import { HtmlUpdate } from '../../server/types'
import { setHtmlContent } from '../db/htmlUpdates'
const router = express.Router()

router.post('/', async (req, res) => {
  const htmlUpdate: HtmlUpdate = req.body
  console.log('update received')
  await setHtmlContent(htmlUpdate.content)
  res.send('update completed')
})


export default router