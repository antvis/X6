import * as util from '../../util'
import { Shape, ArrowConnector } from '../../shape'

export class FlexArrowShape extends ArrowConnector {
  defaultWidth = 10
  defaultArrowWidth = 20

  constructor() {
    super()
    this.spacing = 0
  }

  getStartArrowWidth() {
    return (
      this.getEdgeWidth() +
      util.getNumber(this.style, 'startWidth', this.defaultArrowWidth)
    )
  }

  getEndArrowWidth() {
    return (
      this.getEdgeWidth() +
      util.getNumber(this.style, 'endWidth', this.defaultArrowWidth)
    )
  }

  getEdgeWidth() {
    return (
      util.getNumber(this.style, 'width', this.defaultWidth) +
      Math.max(0, this.strokeWidth - 1)
    )
  }
}

Shape.register('flexArrow', FlexArrowShape)
