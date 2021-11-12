import { model, Model } from 'mongoose'
import { HtmlUpdateSchema } from './schemas'
import { HtmlUpdateDb } from './types'

const HtmlUpdateModel: Model<HtmlUpdateDb> = model('HtmlUpdate', HtmlUpdateSchema)

export async function getHtmlContent(): Promise<string | null> {
  const htmlUpdates = await HtmlUpdateModel.find()
  if (htmlUpdates.length) {
    const firstHtmlUpdate = htmlUpdates[0]
    return firstHtmlUpdate.content
  } else {
    return null
  }
}