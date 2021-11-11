import fs from 'fs'
import readline from 'readline'

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.promises.stat(path)
    return true
  } catch (e) {
    return false
  }
}

export async function createFolder(folder: string) {
  await fs.promises.mkdir(folder)
}

export async function remove(path: string) {
  await fs.promises.unlink(path)
}

export class LineReader {
  private lines: string[] | null = null
  private readPos: number = 0

  async load(path: string) {
    const fileStream = fs.createReadStream(path)
    const readLines = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })
  
    const lines = []
    for await (const line of readLines) {
      lines.push(line)
    }
    
    this.lines = lines
  }

  hasNext(): boolean {
    this.validateIfLoaded()
    return this.readPos !== this.lines!.length
  }

  next(): string {
    this.validateIfLoaded()
    if (this.hasNext()) {
      return this.lines![this.readPos++]
    } else {
      throw Error('There are no more lines')
    }
  }

  validateIfLoaded() {
    if (!this.lines) {
      throw Error('File not loaded')
    }
  }
}

export class LineWriter {
  private writeStream: fs.WriteStream

  constructor(path: string) {
    this.writeStream = fs.createWriteStream(path)
  }

  writeLine(line?: string) {
    if (line) {
      this.writeStream.write(line)
    }
    this.writeStream.write('\n')
  }

  close() {
    this.writeStream.close()
  }
}