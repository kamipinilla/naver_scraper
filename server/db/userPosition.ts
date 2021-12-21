import { LineWriter, pathExists, readFile } from '../files'

const userPositionFile = 'userPosition.txt'

export function getUserPosition(): number {
  if (pathExists(userPositionFile)) {
    const userPositionStr = readFile(userPositionFile)
    const userPosition = parseInt(userPositionStr)
    return userPosition
  } else {
    throw Error(fileNotFoundErrorMessage())
  }
}

export function setUserPosition(userPosition: number): void {
  if (pathExists(userPositionFile)) {
    const userPositionStream = new LineWriter(userPositionFile)

    const userPositionStr = userPosition.toString()
    userPositionStream.writeLine(userPositionStr)

    userPositionStream.close()
  } else {
    throw Error(fileNotFoundErrorMessage())
  }
}

function fileNotFoundErrorMessage(): string {
  return `${userPositionFile} file not found`
}