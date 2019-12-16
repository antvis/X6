import { BaseGraph } from './base-graph'

export class PageBreakAccessor extends BaseGraph {
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
    if (!this.isPageBreakEnabled()) {
      this.options.pageBreak.enabled = true
      this.sizeDidChange()
    }
    return this
  }

  disablePageBreak() {
    if (this.isPageBreakEnabled()) {
      this.options.pageBreak.enabled = false
      this.sizeDidChange()
    }
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
    if (this.getPageBreakColor() !== color) {
      this.options.pageBreak.stroke = color
      this.sizeDidChange()
    }
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
    if (dsahed !== this.isPageBreakDashed()) {
      this.options.pageBreak.dsahed = dsahed
      this.sizeDidChange()
    }
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
    if (minDist !== this.getPageBreakMinDist()) {
      this.options.pageBreak.minDist = minDist
      this.sizeDidChange()
    }
    return this
  }

  get pageBreakMinDist() {
    return this.getPageBreakMinDist()
  }

  set pageBreakMinDist(minDist: number) {
    this.setPageBreakMinDist(minDist)
  }

  updatePageBreaks(visible: boolean, width: number, height: number) {
    this.pageBreakManager.updatePageBreaks(visible, width, height)
    return this
  }
}

export interface PageBreakOptions {
  /**
   * Specifies if a dashed line should be drawn between multiple pages.
   *
   * Default is `false`.
   */
  enabled: boolean
  /**
   * Specifies the stroke color for page breaks.
   *
   * Default is `#808080`.
   */
  stroke: string
  /**
   * Specifies the page breaks should be dashed.
   *
   * Default is `true`.
   */
  dsahed: boolean
  /**
   * Specifies the minimum distance for page breaks to be visible.
   *
   * Default is `20`.
   */
  minDist: number
}
