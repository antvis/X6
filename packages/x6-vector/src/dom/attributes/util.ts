import { Env } from '../../global/env'

export namespace Util {
  export function tryConvertToNumber(value: string | undefined | null) {
    if (value != null) {
      const numReg = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i
      return numReg.test(value) ? +value : value
    }
    return value
  }

  export function camelCase(str: string) {
    return str.replace(/[-:]([a-z])/g, (input) => input[1].toUpperCase())
  }
}

export namespace Util {
  // A javascript: URL can contain leading C0 control or \u0020 SPACE,
  // and any newline or tab are filtered out as if they're not part of the URL.
  // https://url.spec.whatwg.org/#url-parsing
  // Tab or newline are defined as \r\n\t:
  // https://infra.spec.whatwg.org/#ascii-tab-or-newline
  // A C0 control is a code point in the range \u0000 NULL to \u001F
  // INFORMATION SEPARATOR ONE, inclusive:
  // https://infra.spec.whatwg.org/#c0-control-or-space

  // eslint-disable-next-line
  const isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i

  let didWarn = false

  export function sanitizeURL(attributeName: string, url: string) {
    if (Env.isDev) {
      if (!didWarn && isJavaScriptProtocol.test(url)) {
        didWarn = true
        console.error(
          `Attribute "${attributeName}" with javascript url was blocked for security precaution. ` +
            `Check the passed url: ${JSON.stringify(url)}`,
        )
      }
    }
  }
}
