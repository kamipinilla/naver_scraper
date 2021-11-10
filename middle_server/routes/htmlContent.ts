import express from 'express'
import { HtmlUpdate } from '../../server/types'
import { setHtmlContent } from '../db/htmlContent'
const router = express.Router()

router.put('/', async (req, res) => {
  const htmlUpdate: HtmlUpdate = req.body
  console.log('HTML update received')
  await setHtmlContent(htmlUpdate.content)
  res.send('HTML update completed')
})


export default router