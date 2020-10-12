suos
====

Search String on Site

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/suos.svg)](https://npmjs.org/package/suos)
[![Downloads/week](https://img.shields.io/npm/dw/suos.svg)](https://npmjs.org/package/suos)
[![License](https://img.shields.io/npm/l/suos.svg)](https://github.com/TerrorSquad/suos/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g suos
$ suos COMMAND
running command...
$ suos (-v|--version|version)
suos/2.0.0 linux-x64 node-v14.9.0
$ suos --help [COMMAND]
USAGE
  $ suos COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
```sh-session
$ suos mySitemapl.xml "admin.com"
Runs suos on the the file mySitemapl.xml and searches for the string "admin.com" in the response of each page.
$ suos mySitemap.xml -a
Runs suos on mySitemap.xml and searches for the string ""
```
<!-- commandsstop -->
This command can be used to search for a specific string inside the `href` attribute of every `<a>` tag on a web page. It requires a sitemap xml file containing the list of URL on which the search will take place.
