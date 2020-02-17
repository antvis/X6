export namespace UrlExt {
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

  export function isDataUri(url: string) {
    const prefix = 'data:'
    return url.substr(0, prefix.length) === prefix
  }

  /**
   * Converts an image at `url` to base64-encoded data uri.
   * The mime type of the image is inferred from the `url` file extension.
   */
  export function imageToDataUri(
    url: string,
    callback: (err: Error | null, dataUri?: string) => any,
  ) {
    // No need to convert to data uri if it is already in data uri.
    if (!url || isDataUri(url)) {
      // Keep the async nature of the function.
      setTimeout(() => callback(null, url))
      return
    }

    const onError = () => {
      callback(new Error(`Failed to load image: ${url}`))
    }

    const onLoad = window.FileReader
      ? // chrome, IE10+
        (xhr: XMLHttpRequest) => {
          if (xhr.status === 200) {
            const reader = new FileReader()
            reader.onload = evt => {
              const dataUri = evt.target!.result as string
              callback(null, dataUri)
            }

            reader.onerror = onError
            reader.readAsDataURL(xhr.response)
          } else {
            onError()
          }
        }
      : (xhr: XMLHttpRequest) => {
          const toString = (u8a: Uint8Array) => {
            const CHUNK_SZ = 0x8000
            const c = []
            for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
              c.push(
                String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)),
              )
            }
            return c.join('')
          }

          if (xhr.status === 200) {
            let suffix = url.split('.').pop() || 'png'
            if (suffix === 'svg') {
              suffix = 'svg+xml'
            }
            const meta = `data:image/${suffix};base64,`
            const bytes = new Uint8Array(xhr.response)
            const base64 = meta + btoa(toString(bytes))
            callback(null, base64)
          } else {
            onError()
          }
        }

    const xhr = new XMLHttpRequest()
    xhr.responseType = window.FileReader ? 'blob' : 'arraybuffer'
    xhr.open('GET', url, true)
    xhr.addEventListener('error', onError)
    xhr.addEventListener('load', () => onLoad(xhr))
    xhr.send()
  }

  export function dataUriToBlob(dataUri: string) {
    let uri = dataUri.replace(/\s/g, '')
    uri = decodeURIComponent(uri)

    const index = uri.indexOf(',')
    const dataType = uri.slice(0, index) // e.g. 'data:image/jpeg;base64'
    const mime = dataType.split(':')[1].split(';')[0] // e.g. 'image/jpeg'

    const data = uri.slice(index + 1)
    let decodedString: string
    if (dataType.indexOf('base64') >= 0) {
      // data may be encoded in base64
      decodedString = atob(data)
    } else {
      // convert the decoded string to UTF-8
      decodedString = unescape(encodeURIComponent(data))
    }

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(decodedString.length)
    for (let i = 0; i < decodedString.length; i += 1) {
      ia[i] = decodedString.charCodeAt(i)
    }

    return new Blob([ia], { type: mime })
  }

  export function downloadBlob(blob: Blob, fileName: string) {
    if (window.navigator.msSaveBlob) {
      // requires IE 10+
      // pulls up a save dialog
      window.navigator.msSaveBlob(blob, fileName)
    } else {
      // other browsers
      // downloads directly in Chrome and Safari

      // presents a save/open dialog in Firefox
      // Firefox bug: `from` field in save dialog always shows `from:blob:`
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1053327

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = fileName
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
      // mark the url for garbage collection
      window.URL.revokeObjectURL(url)
    }
  }

  export function downloadDataUri(dataUri: string, fileName: string) {
    const blob = dataUriToBlob(dataUri)
    downloadBlob(blob, fileName)
  }
}
