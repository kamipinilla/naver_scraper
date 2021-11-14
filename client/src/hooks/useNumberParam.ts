import useParam from './useParam'

export default function useNumberParam(name: string): number {
  const rawParam = useParam(name)

  const param = parseInt(rawParam)
  if (isNaN(param)) {
    throw Error(`${name} param must be a number: ${rawParam}`)
  }

  return param
}