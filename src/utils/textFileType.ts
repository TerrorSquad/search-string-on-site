import { isBinaryFile } from 'isbinaryfile'

const isTextFile = async (filePath: string) => {
      const isBinary = await isBinaryFile(filePath)

      return !isBinary
}

export default isTextFile
