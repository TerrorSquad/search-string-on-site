import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import isTextFile from './utils/textFileType'
import xml2Json from './utils/xmlToJson'
import got from 'got'

const findUrlsOnPage = async (listOfUrls: Set<string>, urlToFind: string, credentials: any) => {
  const bodyRegex = /(<body>[\s\W\w]*?<\/body>)/g
  const scriptRegex = /(<script>[\s\W\w]*<\/script>)/g
  const allHrefUrlRegex = /(?:href="(?<url>.*?)")/gi

  listOfUrls.forEach(async url => {
    try {
      const res = await got(url, {
        username: credentials.username,
        password: credentials.password,
        https: {
          rejectUnauthorized: true,
        },
      })
      const htmlBody = res?.body?.match(bodyRegex)?.[0]
      const cleanBody = htmlBody?.replace(scriptRegex, '')

      const allHrefLinks = cleanBody?.matchAll(allHrefUrlRegex) || []
      const allHrefs = [...allHrefLinks].map((regexMatch: any) => {
        return regexMatch.groups.url
      })

      const hrefs = allHrefs.filter((url: string) => {
        return url.match(new RegExp(urlToFind, 'gi'))
      })

      if (hrefs.length > 0) {
        const resultSet = new Set(hrefs)
        for (const result of resultSet) {
          console.log(`${url},${result}`)
        }
      }
    } catch (e) {
      console.error(url, e.message)
    }
  })
}

class Suos extends Command {
  static description='Searches all pages of website based on a sitemap and search string'

  static flags={
    allUrls: flags.boolean({name: 'allUrls', char: 'a', description: 'Allow running command without passing a url to find', default: false}),
    username: flags.string({name: 'username', char: 'u', description: 'HTTP username', default: ''}),
    password: flags.string({name: 'password', char: 'p', description: 'HTTP password', default: ''}),
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  static args=[{name: 'file'}, {name: 'urlToFind'}]

  async run() {
    const {args, flags} = this.parse(Suos)
    const file = args.file
    if (!file) {
      throw new Error('You must specify a file path')
    }
    try {
      if (!(await isTextFile(file))) {
        throw new Error('You must provide a text file.')
      }
    } catch (error) {
      throw new Error('File does not exist!')
    }
    let urlToFind = ''
    if (!flags.allUrls) {
      urlToFind = args.urlToFind
      if (!urlToFind)
        throw new Error('You must provide a URL to search for')
    }

    const xmlData = fs.readFileSync(file, 'utf8')
    const parsedXml = xml2Json(xmlData)
    const listOfUrls = new Set<string>()
    parsedXml.urlset.url.forEach((el: any) => {
      listOfUrls.add(el.loc)
    })
    await findUrlsOnPage(listOfUrls, urlToFind, {username: flags.username, password: flags.password})
  }
}

export = Suos
