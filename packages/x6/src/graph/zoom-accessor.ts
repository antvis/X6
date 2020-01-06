import { Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { BaseGraph } from './base-graph'

export class ZoomAccessor extends BaseGraph {
  zoomIn() {
    this.zoom(this.scaleFactor)
    return this
  }

  zoomOut() {
    this.zoom(1 / this.scaleFactor)
    return this
  }

  zoomTo(scale: number, center?: boolean) {
    this.zoom(scale / this.view.scale, center)
    return this
  }

  /**
   * Resets the zoom and panning in the view.
   */
  zoomActual() {
    if (this.view.scale === 1) {
      this.view.setTranslate(0, 0)
    } else {
      this.view.translate.x = 0
      this.view.translate.y = 0

      this.view.setScale(1)
    }
    return this
  }

  /**
   * Zooms the graph using the given factor. Center is an optional boolean
   * argument that keeps the graph scrolled to the center.
   */
  zoom(factor: number, center: boolean = this.centerZoom) {
    this.zoomManager.zoom(factor, center)
    return this
  }

  /**
   * Centers the graph in the container.
   *
   * @param horizontal Optional boolean that specifies if the graph should be
   * centered horizontally. Default is `true`.
   * @param vertical Optional boolean that specifies if the graph should be
   * centered vertically. Default is `true`.
   * @param cx Optional float that specifies the horizontal center.
   * Default is `0.5`.
   * @param cy Optional float that specifies the vertical center.
   * Default is `0.5`.
   */
  center(
    horizontal: boolean = true,
    vertical: boolean = true,
    cx: number = 0.5,
    cy: number = 0.5,
  ) {
    this.zoomManager.center(horizontal, vertical, cx, cy)
    return this
  }

  /**
   * Scales the graph such that the complete diagram fits into container.
   *
   * @param border Optional number that specifies the border.
   * @param keepOrigin Optional boolean that specifies if the translate
   * should be changed. Default is `false`.
   * @param margin Optional margin in pixels. Default is `0`.
   * @param enabled Optional boolean that specifies if the scale should
   * be set or just returned. Default is `true`.
   * @param ignoreWidth Optional boolean that specifies if the width should
   * be ignored. Default is `false`.
   * @param ignoreHeight Optional boolean that specifies if the height should
   * be ignored. Default is `false`.
   * @param maxHeight Optional maximum height.
   */
  fit(
    border: number = this.getBorder(),
    keepOrigin: boolean = false,
    margin: number = 0,
    enabled: boolean = true,
    ignoreWidth: boolean = false,
    ignoreHeight: boolean = false,
    maxHeight?: number,
  ) {
    this.zoomManager.fit(
      border,
      keepOrigin,
      margin,
      enabled,
      ignoreWidth,
      ignoreHeight,
      maxHeight,
    )

    return this.view.scale
  }

  /**
   * Zooms the graph to the specified rectangle. If the rectangle does not have
   * same aspect ratio as the display container, it is increased in the smaller
   * relative dimension only until the aspect match. The original rectangle is
   * centralised within this expanded one.
   *
   * Note that the input rectangle must be un-scaled and un-translated.
   */
  zoomToRect(rect: Rectangle) {
    this.zoomManager.zoomToRect(rect)
    return this
  }

  /**
   * Pans the graph so that it shows the given cell. Optionally the cell may
   * be centered in the container.
   */
  scrollCellToVisible(cell: Cell, center: boolean = false) {
    this.zoomManager.scrollCellToVisible(cell, center)
    return this
  }

  /**
   * Pans the graph so that it shows the given rectangle.
   */
  scrollRectToVisible(rect: Rectangle) {
    return this.zoomManager.scrollRectToVisible(rect)
  }

  /**
   * Scrolls the graph to the given point, extending
   * the graph container if specified.
   */
  scrollPointToVisible(
    x: number,
    y: number,
    extend: boolean = false,
    border: number = 20,
  ) {
    this.zoomManager.scrollPointToVisible(x, y, extend, border)
    return this
  }
}
