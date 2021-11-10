import { Object } from '../types'

export async function get(url: string): Promise<Response> {
  return await fetch(url)
}

export async function post(url: string, requestObject?: Object): Promise<Response> {
  const config: RequestInit = {
    method: 'POST',
  }

  if (requestObject) {
    config.headers = { 'Content-Type': 'application/json' }
    config.body = JSON.stringify(requestObject)
  }

  return await fetch(url, config)
}

export async function del(url: string): Promise<Response> {
  return await fetch(url, { method: 'DELETE' })
}