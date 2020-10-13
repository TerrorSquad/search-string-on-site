suos
====

Search String on Site

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/suos.svg)](https://npmjs.org/package/suos)
[![Downloads/week](https://img.shields.io/npm/dw/suos.svg)](https://npmjs.org/package/suos)
[![License](https://img.shields.io/npm/l/suos.svg)](https://github.com/TerrorSquad/suos/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Description](#description)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g suos
$ suos COMMAND
running command...
$ suos (-v|--version|version)
suos/2.1.1 linux-x64 node-v14.13.1
$ suos --help [COMMAND]
USAGE
  $ suos COMMAND
...
```
<!-- usagestop -->

# Description

This command can be used to search for a specific string inside the `href` attribute of every `<a>` tag on a web page. It requires a sitemap xml file containing the list of URL on which the search will take place.

It will write to STDOUT in a csv format by default.

$ suos (-u|--username)
Username for HTTP auth
$ suos (-p|--password)
Password for HTTP auth. Password is dependant on username
$ suos -P
Print the search regex
$ suos -a
Search for any URL

e.g.
$ suos mySitemap.xml -a -P -u myUser -p superHardPassword
