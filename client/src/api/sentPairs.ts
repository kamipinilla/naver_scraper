import { RestError } from '../../../server/routes/types'
import { SentPairId } from '../../../server/types'
import { UpdateSentPair } from '../../../server/db/types'
import { apiPath } from './config'
import { del, put } from './rest'

const entryName = 'sentPairs'

export async function deleteSentPair(sentPairId: SentPairId): Promise<void> {
  const response = await del(`${apiPath}/${entryName}/${sentPairId}`)
  if (!response.ok) {
    const error: RestError = await response.json()
    throw Error(error.message)
  }
}

export async function updateSentPair(sentPairId: SentPairId, update: UpdateSentPair): Promise<void> {
  const response = await put(`${apiPath}/${entryName}/${sentPairId}`, update)
  if (!response.ok) {
    const error: RestError = await response.json()
    throw Error(error.message)
  }
}