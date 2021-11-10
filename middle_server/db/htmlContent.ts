import { HtmlUpdateSchema } from '../../server/schemas'
import { HtmlUpdateDb } from '../../server/types'
import { model, Model } from 'mongoose'

const HtmlUpdateModel: Model<HtmlUpdateDb> = model('HtmlUpdate', HtmlUpdateSchema)

export async function setHtmlContent(content: string): Promise<void> {
  const htmlUpdates = await HtmlUpdateModel.find()
  if (htmlUpdates.length) {
    const firstHtmlUpdate = htmlUpdates[0]
    firstHtmlUpdate.content = content
    await firstHtmlUpdate.save()
    console.log('HTML content updated')
  } else {
    const newHtmlUpdate = new HtmlUpdateModel({ content })
    await newHtmlUpdate.save()
    console.log('HTML content created')
  }
}