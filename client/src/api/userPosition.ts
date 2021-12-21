import { RestError } from '../../../server/routes/types'
import { apiPath } from './config'
import { get, put } from './rest'

const entryName = 'userPosition'

export async function getUserPosition(): Promise<number> {
  const response = await get(`${apiPath}/${entryName}`)
  if (response.ok) {
    const userPosition = parseInt(await response.text())
    return userPosition
  } else {
    const error = (await response.json()) as RestError
    throw Error(error.message)
  }
}

export async function setUserPosition(userPosition: number): Promise<void> {
  const response = await put(`${apiPath}/${entryName}?value=${userPosition}`, null)
  if (!response.ok) {
    const error = (await response.json()) as RestError
    throw Error(error.message)
  }
}