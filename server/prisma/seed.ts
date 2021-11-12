import { PrismaClient, Word, PrismaPromise } from '@prisma/client'
import { LineReader } from '../files'

const prisma = new PrismaClient()

async function main() {
  await loadWords()
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

async function loadWords() {
  const wordCount = await prisma.word.count()
  if (wordCount) {
    return
  }

  const words = await readWordsFromFile()
  const createPromises: PrismaPromise<any>[] = []
  for (const [index, word] of words.entries()) {
    const id = index + 1
    const createPromise = prisma.word.create({
      data: {
        id,
        name: word,
      }
    })
    createPromises.push(createPromise)
  }
  console.log('Loading words...')
  await prisma.$transaction(createPromises)
}

async function readWordsFromFile(): Promise<string[]> {
  const lineReader = new LineReader()
  const wordsPath = 'data/50k'
  await lineReader.load(wordsPath)
  
  const words: string[] = []
  while (lineReader.hasNext()) {
    const line = lineReader.next()
    const [word, _] = line.split(' ')
    words.push(word)
  }

  return words
}
