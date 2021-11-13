import express from 'express'
import { HtmlUpdate } from '../../server/types'
import { RestSuccess } from '../../server/routes/types'
import { setHtmlContent } from '../db/htmlContent'
const router = express.Router()

router.put('/', async (req, res) => {
  const htmlUpdate: HtmlUpdate = req.body
  console.log('HTML update received')
  await setHtmlContent(htmlUpdate.content)
  res.json({ message: 'HTML update completed' } as RestSuccess)
})


export default router