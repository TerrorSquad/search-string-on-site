import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import isTextFile from './utils/textFileType'
import xml2Json from './utils/xmlToJson'
import got from 'got'

class Ssos extends Command {
  static description = 'describe the command here'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Ssos)
    const file = args.file
    if (!file) {
      throw new Error(`You must specify a file`)
    }
    if (!isTextFile(file)) {
      throw new Error(`You must provide a text file.`)
    }

    const xmlData = fs.readFileSync(file, "utf8")
    const parsedXml = xml2Json(xmlData);

    const listOfUrls = new Set()
    parsedXml.urlset.url.forEach((el: any)=> {
      listOfUrls.add(el.loc);
    })



const bodyRegex = /(<body>[\s\W\w]*?<\/body>)/g
const hrefRegex = /(?:href="(?<url>http(?:s)?:\/\/(?:www\.)?(?:admin).*?)")/gm;

listOfUrls.forEach((url: any)=> {
    got(url).then((res) => {
        const htmlBody = res?.body?.match(bodyRegex)?.[0];
        const hrefsMatches = htmlBody?.matchAll(hrefRegex) || []
        const hrefs = Array.from(hrefsMatches, (regexMatch: any) => {
            return regexMatch.groups.url
        })

        if (hrefs.length) {
            console.log(`Result found on URL: ${url}`);
            console.dir(new Set(hrefs))
        }
    }).catch(err => {
        console.log(err);
    });
})

  }
}

export = Ssos
