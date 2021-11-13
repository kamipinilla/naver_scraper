import fs from 'fs'
import readline from 'readline'

export function createLineReader(path: string): readline.Interface {
  const readStream = fs.createReadStream(path)
  const readLineInterface = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  })
  return readLineInterface
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

