import { createFolder, exists, LineReader, LineWriter, remove } from '../files'
import { SentPair } from '../types'

const selectedFolder = 'cloze'

function getWordPath(wordRank: number) {
  return `${selectedFolder}/${wordRank}`
}

export async function getSelected(wordRank: number): Promise<SentPair[]> {
  const wordPath = getWordPath(wordRank)
  if (!await exists(wordPath)) {
    return []
  }

  const linesReader = new LineReader()
  await linesReader.load(wordPath)

  const numSentPairs = parseInt(linesReader.next())
  const selected: SentPair[] = []
  for (let i = 0; i < numSentPairs; i++) {
    const targetSent = linesReader.next()
    const sourceSent = linesReader.next()
    linesReader.next()

    const sentPair: SentPair = {
      targetSent,
      sourceSent,
    }
    selected.push(sentPair)
  }

  return selected
}

export async function setSelected(wordRank: number, selected: SentPair[]) {
  const wordPath = getWordPath(wordRank)
  if (selected.length) {
    if (!await exists(selectedFolder)) {
      await createFolder(selectedFolder)
    }

    const lineWriter = new LineWriter(wordPath)
    lineWriter.writeLine(selected.length.toString())
    for (const sentPair of selected) {
      lineWriter.writeLine(sentPair.targetSent)
      lineWriter.writeLine(sentPair.sourceSent)
      lineWriter.writeLine()
    }
    lineWriter.close()
  } else {
    if (await exists(wordPath)) {
      await remove(wordPath)
    }
  }
}