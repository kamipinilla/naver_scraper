import { RestError, RestItems } from '../../../server/routes/types'
import { SentPair, Word, WordId } from '../../../server/types'
import { NewSentPair } from '../../../server/db/types'
import { apiPath } from './config'
import { get, post } from './rest'

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

export async function getWord(wordId: WordId): Promise<Word> {
  const response = await get(`${apiPath}/${entryName}/${wordId}`)
  const json = await response.json()
  if (response.ok) {
    const word = json as Word
    return word
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

export async function addSentPair(wordId: WordId, newSentPair: NewSentPair): Promise<void> {
  const response = await post(`${apiPath}/${entryName}/${wordId}/sentPairs`, newSentPair)
  if (!response.ok) {
    const error = await response.json() as RestError
    throw Error(error.message)
  }
}