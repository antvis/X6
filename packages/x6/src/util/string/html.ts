import JQuery from 'jquery'

/**
 * Sanitizes HTML with jQuery prevent Application from XSS attacks.
 * ref: https://gist.github.com/ufologist/5a0da51b2b9ef1b861c30254172ac3c9
 */
export function sanitizeHTML(html: string): string
export function sanitizeHTML(html: string, options: { raw: false }): string
export function sanitizeHTML(
  html: string,
  options: { raw: true },
): JQuery.Node[]
export function sanitizeHTML(html: string, options: { raw?: boolean } = {}) {
  // If documentContext (second parameter) is not specified or given as
  // `null` or `undefined`, a new document is used. Inline events will not
  // execute when the HTML is parsed; this includes, for example, sending
  // GET requests for images.

  // If keepScripts (last parameter) is `false`, scripts are not executed.
  const nodes = JQuery.parseHTML(html, null, false)

  nodes.forEach((node) => {
    const elem = node as Element
    if (elem) {
      const attrs = elem.attributes
      if (attrs) {
        for (let i = 0, ii = attrs.length; i < ii; i += 1) {
          const attr = attrs.item(i)
          if (attr) {
            const val = attr.value.toLowerCase()
            const name = attr.name.toLowerCase()

            // Removes attribute name starts with "on" (e.g. onload,
            // onerror...).
            // Removes attribute value starts with "javascript:" pseudo
            // protocol (e.g. `href="javascript:alert(1)"`).
            if (
              name.startsWith('on') ||
              val.startsWith('javascript:') || // eslint-disable-line no-script-url
              // ref: https://lgtm.com/rules/1510852698359/
              val.startsWith('data:') ||
              val.startsWith('vbscript:')
            ) {
              elem.removeAttribute(name)
            }
          }
        }
      }
    }
  })

  if (options.raw) {
    return nodes
  }

  return JQuery('<div/>').append(nodes).html()
}
