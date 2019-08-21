import { isRelativeUrl } from '../util'

export class UrlConverter {
  private enabled: boolean = true
  public baseUrl: string
  public baseDomain: string

  isEnabled() {
    return this.enabled
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  updateFromLocation() {
    this.baseDomain = `${location.protocol}//${location.host}`
    this.baseUrl = this.baseDomain + location.pathname
    const index = this.baseUrl.lastIndexOf('/')
    // strips filename etc
    if (index > 0) {
      this.baseUrl = this.baseUrl.substring(0, index + 1)
    }
  }

  toAbsolute(url: string) {
    if (this.enabled && isRelativeUrl(url)) {
      if (this.baseUrl == null) {
        this.updateFromLocation()
      }

      if (url.charAt(0) === '/') {
        return this.baseDomain + url
      }

      return this.baseUrl + url
    }

    return url
  }
}
