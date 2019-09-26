import { CellMarker } from '../cell-marker'
import { ConstraintHandler } from '../constraint/handler'

/**
 * Transparent cell hilight when constraint point is highlighted.
 */
export function transparentMarker(
  constraintHandler: ConstraintHandler,
  marker: CellMarker,
) {
  if (
    constraintHandler.currentState != null &&
    constraintHandler.currentConstraint != null
  ) {
    if (
      marker.highlight != null &&
      marker.highlight.shape != null &&
      marker.highlight.state != null &&
      marker.highlight.state.cell === constraintHandler.currentState.cell
    ) {
      if (marker.highlight.shape.stroke !== 'transparent') {
        marker.highlight.shape.stroke = 'transparent'
        marker.highlight.repaint()
      }
    } else {
      marker.markCell(
        constraintHandler.currentState.cell,
        'transparent',
      )
    }
  }
}
