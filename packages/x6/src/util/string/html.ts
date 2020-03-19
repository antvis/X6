import $ from 'jquery'

/**
 * Sanitizes HTML with jQuery prevent Application from XSS attacks.
 * ref: https://gist.github.com/ufologist/5a0da51b2b9ef1b861c30254172ac3c9
 */
export function sanitizeHTML(html: string) {
  // If documentContext (second parameter) is not specified or given as
  // `null` or `undefined`, a new document is used. Inline events will not
  // execute when the HTML is parsed; this includes, for example, sending
  // GET requests for images.

  // If keepScripts (last parameter) is `false`, scripts are not executed.
  const output = $($.parseHTML(`<div>${html}</div>`, null, false))

  output
    .find('*')
    .toArray()
    .forEach(currentNode => {
      const node = (currentNode as any) as Element
      if (node) {
        const attrs = node.attributes
        if (attrs) {
          for (let i = 0, l = attrs.length; i < l; i += 1) {
            const attr = attrs.item(i)
            if (attr) {
              const val = attr.value
              const name = attr.name

              // Removes attribute name starts with "on" (e.g. onload,
              // onerror...).
              // Removes attribute value starts with "javascript:" pseudo
              // protocol (e.g. `href="javascript:alert(1)"`).
              if (
                name.indexOf('on') === 0 ||
                val.indexOf('javascript:') === 0
              ) {
                node.removeAttribute(name)
              }
            }
          }
        }
      }
    })

  return output.html()
}

/**
 * Removes blank space in markup to prevent create empty text node.
 */
export function sanitizeMarkup(markup: string) {
  return `${markup}`.trim().replace(/\/\>\s+\</g, '/><')
}
