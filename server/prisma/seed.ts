import { PrismaClient, PrismaPromise } from '@prisma/client'
import { createLineReader } from '../files'

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
    console.log('Words already populated')
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
  console.log('Populating words...')
  await prisma.$transaction(createPromises)
}

async function readWordsFromFile(): Promise<string[]> {
  const wordsPath = 'data/50k'
  const lineReader = createLineReader(wordsPath)
  
  const words: string[] = []
  for await (const line of lineReader) {
    const word = line.split(' ')[0]
    words.push(word)
  }

  return words
}
