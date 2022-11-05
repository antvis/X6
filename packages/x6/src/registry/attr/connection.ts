import { EdgeView } from '../../view'
import { Attr } from './index'

const isEdgeView: Attr.QualifyFucntion = (val, { view }) => {
  return view.cell.isEdge()
}

export const connection: Attr.Definition = {
  qualify: isEdgeView,
  set(val, args) {
    const view = args.view as EdgeView
    const reverse = ((val as any).reverse || false) as boolean
    const stubs = ((val as any).stubs || 0) as number
    let d
    if (Number.isFinite(stubs) && stubs !== 0) {
      if (!reverse) {
        let offset
        if (stubs < 0) {
          const len = view.getConnectionLength() || 0
          offset = (len + stubs) / 2
        } else {
          offset = stubs
        }

        const path = view.getConnection()
        if (path) {
          const sourceParts = path.divideAtLength(offset)
          const targetParts = path.divideAtLength(-offset)
          if (sourceParts && targetParts) {
            d = `${sourceParts[0].serialize()} ${targetParts[1].serialize()}`
          }
        }
      } else {
        let offset
        let length
        const len = view.getConnectionLength() || 0
        if (stubs < 0) {
          offset = (len + stubs) / 2
          length = -stubs
        } else {
          offset = stubs
          length = len - stubs * 2
        }

        const path = view.getConnection()
        d = path
          ?.divideAtLength(offset)?.[1]
          ?.divideAtLength(length)?.[0]
          ?.serialize()
      }
    }

    return { d: d || view.getConnectionPathData() }
  },
}

export const atConnectionLengthKeepGradient: Attr.Definition = {
  qualify: isEdgeView,
  set: atConnectionWrapper('getTangentAtLength', { rotate: true }),
}

export const atConnectionLengthIgnoreGradient: Attr.Definition = {
  qualify: isEdgeView,
  set: atConnectionWrapper('getTangentAtLength', { rotate: false }),
}

export const atConnectionRatioKeepGradient: Attr.Definition = {
  qualify: isEdgeView,
  set: atConnectionWrapper('getTangentAtRatio', { rotate: true }),
}

export const atConnectionRatioIgnoreGradient: Attr.Definition = {
  qualify: isEdgeView,
  set: atConnectionWrapper('getTangentAtRatio', { rotate: false }),
}

// aliases
// -------
export const atConnectionLength = atConnectionLengthKeepGradient
export const atConnectionRatio = atConnectionRatioKeepGradient

// utils
// -----

function atConnectionWrapper(
  method: 'getTangentAtLength' | 'getTangentAtRatio',
  options: { rotate: boolean },
): Attr.SetFunction {
  const zeroVector = { x: 1, y: 0 }

  return (value, args) => {
    let p
    let angle

    const view = args.view as EdgeView
    const tangent = view[method](Number(value))
    if (tangent) {
      angle = options.rotate ? tangent.vector().vectorAngle(zeroVector) : 0
      p = tangent.start
    } else {
      p = (view as any).path.start
      angle = 0
    }

    if (angle === 0) {
      return { transform: `translate(${p.x},${p.y}')` }
    }

    return {
      transform: `translate(${p.x},${p.y}') rotate(${angle})`,
    }
  }
}
