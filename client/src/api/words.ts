import { RestError, RestItems } from '../../../server/routes/types'
import { SentPair, Word, WordId } from '../../../server/types'
import { CreateSentPair } from '../../../server/db/types'
import { apiPath } from './config'
import { get, put } from './rest'

const entryName = 'words'

export async function getWords(): Promise<Word[]> {
  const response = await get(`${apiPath}/${entryName}`)
  const json = await response.json()
  if (response.ok) {
    const words = (json as RestItems).items
    return words
  } else {
    const error = json as RestError
    throw Error(error.message)
  }
}

export async function getSentPairs(wordId: WordId): Promise<SentPair[]> {
  const response = await get(`${apiPath}/${entryName}/${wordId}/sentPairs`)
  const json = await response.json()
  if (response.ok) {
    const sentPairs = (json as RestItems).items
    return sentPairs
  } else {
    const error = json as RestError
    throw Error(error.message)
  }
}

export async function setSentPairs(wordId: WordId, sentPairs: CreateSentPair[]): Promise<void> {
  const items: RestItems = { items: sentPairs }
  const response = await put(`${apiPath}/${entryName}/${wordId}/sentPairs`, items)
  if (!response.ok) {
    const error: RestError = await response.json()
    throw Error(error.message)
  }
}