import { Schema } from 'mongoose'
import { model, Model } from 'mongoose'
import { HtmlUpdateDb } from '../types'


export const HtmlUpdateSchema = new Schema({
  content: { type: String, required: true }
})

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