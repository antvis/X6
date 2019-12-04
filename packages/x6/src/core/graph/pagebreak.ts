import { GraphBase } from './base'

export interface PageBreakOptions {
  /**
   * If a dashed line should be drawn between multiple pages.
   *
   * Default is `false`.
   */
  enabled: boolean
  /**
   * The stroke color for page breaks.
   *
   * Default is `#808080`.
   */
  stroke: string
  /**
   * The page breaks should be dashed.
   *
   * Default is `true`.
   */
  dsahed: boolean
  /**
   * The minimum distance for page breaks to be visible.
   *
   * Default is `20`.
   */
  minDist: number
}

export class GraphPageBreak extends GraphBase {
  isPageBreakEnabled() {
    return this.options.pageBreak.enabled
  }

  togglePageBreak() {
    if (this.isPageBreakEnabled()) {
      this.disablePageBreak()
    } else {
      this.enablePageBreak()
    }
    return this
  }

  enablePageBreak() {
    this.options.pageBreak.enabled = true
    return this
  }

  disablePageBreak() {
    this.options.pageBreak.enabled = false
    return this
  }

  get pageBreakEnabled() {
    return this.isPageBreakEnabled()
  }

  set pageBreakEnabled(enabled: boolean) {
    if (enabled) {
      this.enablePageBreak()
    } else {
      this.disablePageBreak()
    }
  }

  getPageBreakColor() {
    return this.options.pageBreak.stroke
  }

  setPageBreakColor(color: string) {
    this.options.pageBreak.stroke = color
    return this
  }

  get pageBreakColor() {
    return this.getPageBreakColor()
  }

  set pageBreakColor(color: string) {
    this.setPageBreakColor(color)
  }

  isPageBreakDashed() {
    return this.options.pageBreak.dsahed
  }

  setPageBreakDashed(dsahed: boolean) {
    this.options.pageBreak.dsahed = dsahed
    return this
  }

  get pageBreakDashed() {
    return this.isPageBreakDashed()
  }

  set pageBreakDashed(dsahed: boolean) {
    this.setPageBreakDashed(dsahed)
  }

  getPageBreakMinDist() {
    return this.options.pageBreak.minDist
  }

  setPageBreakMinDist(minDist: number) {
    this.options.pageBreak.minDist = minDist
    return this
  }

  get pageBreakMinDist() {
    return this.getPageBreakMinDist()
  }

  set pageBreakMinDist(minDist: number) {
    this.setPageBreakMinDist(minDist)
  }
}
