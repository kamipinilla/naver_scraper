import { RestError } from '../../../server/routes/types'
import { SentPairId } from '../../../server/types'
import { apiPath } from './config'
import { del } from './rest'

const entryName = 'sentPairs'

export async function deleteSentPair(sentPairId: SentPairId): Promise<void> {
  const response = await del(`${apiPath}/${entryName}/${sentPairId}`)
  if (!response.ok) {
    const error: RestError = await response.json()
    throw Error(error.message)
  }
}