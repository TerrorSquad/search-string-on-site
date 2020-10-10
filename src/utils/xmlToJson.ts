import * as fasterXmlParser from 'fast-xml-parser'
const he = require('he')
const options = {
  attributeNamePrefix: "@_",
  attrNodeName: "attr",
  textNodeName: "#text",
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: false,
  cdataTagName: "__cdata",
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: false,
  arrayMode: false,
  attrValueProcessor: (val: string, attrName: string) => he.decode(val, {
    isAttributeValue: true
  }), //default is a=>a
  tagValueProcessor: (val: string, tagName: string) => he.decode(val), //default is a=>a
  stopNodes: ["parse-me-as-string"]
};

const xml2Json = (xmlString: string) => {
  if (fasterXmlParser.validate(xmlString) !== true) {
    throw new Error("Content is not a valid XML string!")
  }
  const traversalObj = fasterXmlParser.getTraversalObj(xmlString, options);
  return fasterXmlParser.convertToJson(traversalObj, options);
}

export default xml2Json
