import fs from 'fs'
import readline from 'readline'

export async function readLinesFromFile(file: string): Promise<Array<string | null>> {
  const fileStream = fs.createReadStream(file)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  const lines = []
  for await (const line of rl) {
    lines.push(line || null)
  }
  return lines
}

export function writeLinesToFile(file: string, lines: Array<string | null>) {
  const fileStream = fs.createWriteStream(file)
  for (const line of lines) {
    if (line) {
      fileStream.write(line)
    }
    fileStream.write('\n')
  }
  fileStream.close()
}

export function folderExists(folder: string): boolean {
  return fs.existsSync(folder)
}

export function createFolder(folder: string) {
  fs.mkdirSync(folder)
}