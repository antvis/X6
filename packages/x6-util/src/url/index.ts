export namespace Url {
  export function getUrlWithoutHash(url: string = window.location.href) {
    const href = url
    const idx = href.lastIndexOf('#')
    if (idx > 0) {
      return href.substring(0, idx)
    }
    return href
  }

  let baseDomain: string | null = null
  let baseUrlDir: string | null = null

  function updateBaseUrl() {
    baseDomain = `${location.protocol}//${location.host}`
    baseUrlDir = baseDomain + location.pathname
    const idx = baseUrlDir.lastIndexOf('/')
    // strips filename etc
    if (idx > 0) {
      baseUrlDir = baseUrlDir.substring(0, idx + 1)
    }
  }

  export function isRelative(url: string = window.location.href) {
    return (
      url.substring(0, 2) !== '//' &&
      url.substring(0, 7) !== 'http://' &&
      url.substring(0, 8) !== 'https://' &&
      url.substring(0, 10) !== 'data:image' &&
      url.substring(0, 7) !== 'file://'
    )
  }

  export function toAbsolute(url: string) {
    if (isRelative(url)) {
      if (baseDomain == null || baseUrlDir == null) {
        updateBaseUrl()
      }

      if (url.charAt(0) === '/') {
        return baseDomain + url
      }

      return baseUrlDir + url
    }

    return url
  }
}
