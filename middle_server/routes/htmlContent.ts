import express from 'express'
import { HtmlUpdate, RestSuccess } from '../../server/types'
import { setHtmlContent } from '../db/htmlContent'
const router = express.Router()

router.put('/', async (req, res) => {
  const htmlUpdate: HtmlUpdate = req.body
  console.log('HTML update received')
  await setHtmlContent(htmlUpdate.content)
  const success: RestSuccess = {
    message: 'HTML update completed',
  }
  res.json(success)
})


export default router