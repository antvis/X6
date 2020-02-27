import * as util from '../util/index.mjs'
import { toRad } from '../g/index.mjs'
import { resolveRef } from '../linkAnchors/index.mjs'

export namespace Anchor {
  export const center = box('center')
  export const top = box('topMiddle')
  export const bottom = box('bottomMiddle')
  export const left = box('leftMiddle')
  export const right = box('rightMiddle')
  export const topLeft = box('origin')
  export const topRight = box('topRight')
  export const bottomLeft = box('bottomLeft')
  export const bottomRight = box('corner')
  export const perpendicular = resolveRef(_perpendicular)
  export const midSide = resolveRef(_midSide)
  export const modelCenter = _modelCenter

  function box(method) {
    return function(view, magnet, ref, opt) {
      const rotate = !!opt.rotate
      const bbox = rotate
        ? view.getNodeUnrotatedBBox(magnet)
        : view.getNodeBBox(magnet)
      const anchor = bbox[method]()

      let dx = opt.dx
      if (dx) {
        const dxPercentage = util.isPercentage(dx)
        dx = parseFloat(dx)
        if (isFinite(dx)) {
          if (dxPercentage) {
            dx /= 100
            dx *= bbox.width
          }
          anchor.x += dx
        }
      }

      let dy = opt.dy
      if (dy) {
        const dyPercentage = util.isPercentage(dy)
        dy = parseFloat(dy)
        if (isFinite(dy)) {
          if (dyPercentage) {
            dy /= 100
            dy *= bbox.height
          }
          anchor.y += dy
        }
      }

      return rotate
        ? anchor.rotate(view.model.getBBox().center(), -view.model.angle())
        : anchor
    }
  }

  function _perpendicular(view, magnet, refPoint, opt) {
    const angle = view.model.angle()
    const bbox = view.getNodeBBox(magnet)
    const anchor = bbox.center()
    const topLeft = bbox.origin()
    const bottomRight = bbox.corner()

    let padding = opt.padding
    if (!isFinite(padding)) padding = 0

    if (
      topLeft.y + padding <= refPoint.y &&
      refPoint.y <= bottomRight.y - padding
    ) {
      const dy = refPoint.y - anchor.y
      anchor.x +=
        angle === 0 || angle === 180 ? 0 : (dy * 1) / Math.tan(toRad(angle))
      anchor.y += dy
    } else if (
      topLeft.x + padding <= refPoint.x &&
      refPoint.x <= bottomRight.x - padding
    ) {
      const dx = refPoint.x - anchor.x
      anchor.y +=
        angle === 90 || angle === 270 ? 0 : dx * Math.tan(toRad(angle))
      anchor.x += dx
    }

    return anchor
  }

  function _midSide(view, magnet, refPoint, opt) {
    const rotate = !!opt.rotate
    let bbox, angle, center
    if (rotate) {
      bbox = view.getNodeUnrotatedBBox(magnet)
      center = view.model.getBBox().center()
      angle = view.model.angle()
    } else {
      bbox = view.getNodeBBox(magnet)
    }

    const padding = opt.padding
    if (isFinite(padding)) bbox.inflate(padding)

    if (rotate) refPoint.rotate(center, angle)

    const side = bbox.sideNearestToPoint(refPoint)
    let anchor
    switch (side) {
      case 'left':
        anchor = bbox.leftMiddle()
        break
      case 'right':
        anchor = bbox.rightMiddle()
        break
      case 'top':
        anchor = bbox.topMiddle()
        break
      case 'bottom':
        anchor = bbox.bottomMiddle()
        break
    }

    return rotate ? anchor.rotate(center, -angle) : anchor
  }

  // Can find anchor from model, when there is no selector or the link end
  // is connected to a port
  function _modelCenter(view, _magnet, _refPoint, opt, endType) {
    return view.model
      .getPointFromConnectedLink(this.model, endType)
      .offset(opt.dx, opt.dy)
  }
}
