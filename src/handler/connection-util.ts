import * as util from '../util'
import { Point } from '../struct'
import { Graph } from '../core'
import { CellMarker } from './cell-marker'
import { DomEvent, MouseEventEx } from '../common'

export function isOutlineConnect(
  e: MouseEventEx,
  graph: Graph,
  marker: CellMarker,
  currentPoint: Point,
) {
  const evt = e.getEvent()
  const state = e.getState()

  if (!DomEvent.isShiftDown(evt)) {

    if (
      e.isSource(marker.highlight.shape) ||
      (DomEvent.isAltDown(evt) && state != null)
    ) {
      return true
    }

    const clientX = DomEvent.getClientX(evt)
    const clientY = DomEvent.getClientY(evt)
    if (marker.highlight.isHighlightAt(clientX, clientY)) {
      return true
    }

    const doc = document.documentElement
    const container = graph.container
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
    const offset = util.getOffset(container)
    const gridX = currentPoint.x - container.scrollLeft + offset.x - left
    const gridY = currentPoint.y - container.scrollTop + offset.y - top

    if (
      state == null &&
      (gridX !== clientX || gridY !== clientY) &&
      marker.highlight.isHighlightAt(gridX, gridY)
    ) {
      return true
    }
  }

  return false
}
