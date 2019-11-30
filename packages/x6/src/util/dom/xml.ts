export function createXmlDocument() {
  let doc = null
  if (document.implementation && document.implementation.createDocument) {
    doc = document.implementation.createDocument('', '', null)
  } else if ((window as any).ActiveXObject) {
    doc = new (window as any).ActiveXObject('Microsoft.XMLDOM')
  }
  return doc
}

/**
 * Parses the specified XML string into a new XML document
 * and returns the new document.
 */
export const parseXml = (window as any).DOMParser
  ? function(xml: string) {
      const parser = new DOMParser()
      return parser.parseFromString(xml, 'text/xml')
    }
  : function(xml: string) {
      const result = createXmlDocument()
      result.async = false
      result.validateOnParse = false
      result.resolveExternals = false
      result.loadXML(xml)
      return result
    }
