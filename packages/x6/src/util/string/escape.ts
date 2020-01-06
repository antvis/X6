const escapeMap: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const unescapeMap: { [key: string]: string } = {}
Object.keys(escapeMap).forEach(key => {
  unescapeMap[escapeMap[key]] = key
})

function createEscape(map: { [key: string]: string }) {
  const source = `(?:${Object.keys(map).join('|')})`
  const testRegexp = new RegExp(source)
  const replaceRegexp = new RegExp(source, 'g')

  return (str: string) => {
    return testRegexp.test(str)
      ? str.replace(replaceRegexp, match => map[match])
      : str
  }
}

export const escape = createEscape(escapeMap)
export const unescape = createEscape(unescapeMap)
