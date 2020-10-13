import { Command, flags } from '@oclif/command'
import * as fs from 'fs'
import isTextFile from './utils/textFileType'
import xml2Json from './utils/xmlToJson'
import got from 'got'

class Suos extends Command {
  static description='Searches all pages of website based on a sitemap and search string'

  static flags={
    allUrls: flags.boolean({ name: 'allUrls', char: 'a', description: 'Allow running command without passing a url to find', default: false }),
    printSearchRegex: flags.boolean({ name: 'printSearchRegex', char: 'P', description: 'Print search regex', default: false }),
    username: flags.string({ name: 'username', char: 'u', description: 'HTTP username', default: '' }),
    password: flags.string({ name: 'password', char: 'p', description: 'HTTP password', default: '', dependsOn: ['username'] }),
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  }

  static args=[{ name: 'file' }, { name: 'urlToFind' }]

  async run() {
    const { args, flags }=this.parse(Suos)
    const file=args.file
    if (!file) {
      throw new Error('You must specify a file')
    }
    if (!isTextFile(file)) {
      throw new Error('You must provide a text file.')
    }
    let urlToFind=''
    if (!flags.allUrls) {
      urlToFind=args.urlToFind
      if (!urlToFind)
        throw new Error('You must provide a URL to search for')
    }

    const xmlData=fs.readFileSync(file, 'utf8')
    const parsedXml=xml2Json(xmlData)

    const listOfUrls=new Set<string>()
    parsedXml.urlset.url.forEach((el: any) => {
      listOfUrls.add(el.loc)
    })
    const searchRegex=getSearchRegex(urlToFind)
    if (flags.printSearchRegex) {
      console.log(searchRegex)
    }
    await findUrlsOnPage(listOfUrls, searchRegex, { username: flags.username, password: flags.password })
  }
}

const findUrlsOnPage=async (listOfUrls: Set<string>, searchRegex: RegExp, credentials: any) => {
  const bodyRegex=/(<body>[\s\W\w]*?<\/body>)/g
  const scriptRegex=/(<script>[\s\W\w]*?<\/script>)/g

  listOfUrls.forEach(async url => {
    try {
      const res=await got(url, {
        username: credentials.username,
        password: credentials.password,
        https: {
          rejectUnauthorized: true,
        },
      })
      const htmlBody=res?.body?.match(bodyRegex)?.[0]
      const cleanBody=htmlBody?.replace(scriptRegex, '')
      const hrefsMatches=cleanBody?.matchAll(searchRegex)||[]
      const hrefs=[...hrefsMatches].map((regexMatch: any) => {
        return regexMatch.groups.url
      })

      if (hrefs.length) {
        const resultSet=new Set(hrefs)
        for (const result of resultSet) {
          console.log(`${url},${result}`)
        }
      }
    } catch (e) {
      console.error(url, e.message)
    }
  })
}

const getSearchRegex=(urlToFind: string) => {
  const regexStart='(?:href="'
  const regexUrl=new RegExp('(?<url>.*?'+urlToFind+'.*?)')
  const regexEnd='")'
  const hrefRegex=new RegExp(regexStart+regexUrl.source+regexEnd, 'gm')
  return hrefRegex
}

export = Suos
