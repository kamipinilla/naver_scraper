import { HtmlUpdate, RestError } from '../../../server/types'
import { apiPath } from './config'
import { get } from './rest'

const entryName = 'htmlContent'

export async function getHtmlContent(): Promise<string> {
  const response = await get(`${apiPath}/${entryName}`)
  const json = await response.json()
  if (response.ok) {
    const htmlUpdate = json as HtmlUpdate
    const content = htmlUpdate.content
    return content
  } else {
    const restError = json as RestError
    throw Error(restError.message)
  }
}