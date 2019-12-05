import { CellMarker } from '../cell-marker'
import { AnchorHandler } from '../anchor/handler'

/**
 * Transparent cell hilight when anchor point is highlighted.
 */
export function transparentMarker(
  anchorHandler: AnchorHandler,
  marker: CellMarker,
) {
  if (
    anchorHandler.currentState != null &&
    anchorHandler.currentAnchor != null
  ) {
    if (
      marker.highlight != null &&
      marker.highlight.shape != null &&
      marker.highlight.state != null &&
      marker.highlight.state.cell === anchorHandler.currentState.cell
    ) {
      if (marker.highlight.shape.strokeColor !== 'transparent') {
        marker.highlight.shape.strokeColor = 'transparent'
        marker.highlight.repaint()
      }
    } else {
      marker.markCell(anchorHandler.currentState.cell, 'transparent')
    }
  }
}
