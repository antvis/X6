import { Shape, ObjectExt } from '@antv/x6'

export class FlexArrowShape extends Shape.ArrowConnector {
  defaultWidth = 10
  defaultArrowWidth = 20

  constructor() {
    super()
    this.spacing = 0
  }

  getStartArrowWidth() {
    return (
      this.getEdgeWidth() +
      ObjectExt.getNumber(this.style, 'startWidth', this.defaultArrowWidth)
    )
  }

  getEndArrowWidth() {
    return (
      this.getEdgeWidth() +
      ObjectExt.getNumber(this.style, 'endWidth', this.defaultArrowWidth)
    )
  }

  getEdgeWidth() {
    return (
      ObjectExt.getNumber(this.style, 'width', this.defaultWidth) +
      Math.max(0, this.strokeWidth - 1)
    )
  }
}

Shape.register('flexArrow', FlexArrowShape)
