import { useParams } from 'react-router-dom'

export default function useParam(name: string): string {
  const param = useParams()[name]
  if (param === undefined) {
    throw Error(`Url param not found: ${name}`)
  }

  return param
}