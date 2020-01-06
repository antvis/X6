import { Shape, ObjectExt } from '@antv/x6'

export class LinkShape extends Shape.ArrowConnector {
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
      ObjectExt.getNumber(this.style, 'width', this.defaultWidth) +
      Math.max(0, this.strokeWidth - 1)
    )
  }
}

Shape.register('link', LinkShape)
