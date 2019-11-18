import * as util from '../../util'
import { ArrowConnector } from '../../shape'
import { registerShape } from '../../core'

export class LinkShape extends ArrowConnector {
  defaultWidth = 4

  constructor() {
    super()
    this.spacing = 0
  }

  isOpenEnded() {
    return true
  }

  isArrowRounded() {
    return this.rounded
  }

  getEdgeWidth() {
    return (
      util.getNumber(this.style, 'width', this.defaultWidth) +
      Math.max(0, this.strokeWidth - 1)
    )
  }
}

registerShape('link', LinkShape)
