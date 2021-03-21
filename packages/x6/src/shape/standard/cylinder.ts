import { NumberExt } from '../../util'
import { Base } from '../base'

const CYLINDER_TILT = 10

export const Cylinder = Base.define({
  shape: 'cylinder',
  overwrite: true,
  markup: [
    {
      tagName: 'path',
      selector: 'body',
    },
    {
      tagName: 'ellipse',
      selector: 'top',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      ...Base.bodyAttr,
      lateral: CYLINDER_TILT,
    },
    top: {
      ...Base.bodyAttr,
      refCx: '50%',
      refRx: '50%',
      cy: CYLINDER_TILT,
      ry: CYLINDER_TILT,
    },
  },
  attrHooks: {
    lateral: {
      set(t: number | string, { refBBox }) {
        const isPercentage = NumberExt.isPercentage(t)
        if (isPercentage) {
          // eslint-disable-next-line
          t = parseFloat(t as string) / 100
        }

        const x = refBBox.x
        const y = refBBox.y
        const w = refBBox.width
        const h = refBBox.height

        // curve control point variables
        const rx = w / 2
        const ry = isPercentage ? h * (t as number) : (t as number)

        const kappa = 0.551784
        const cx = kappa * rx
        const cy = kappa * ry

        // shape variables
        const xLeft = x
        const xCenter = x + w / 2
        const xRight = x + w

        const ySideTop = y + ry
        const yCurveTop = ySideTop - ry
        const ySideBottom = y + h - ry
        const yCurveBottom = y + h

        // return calculated shape
        const data = [
          'M',
          xLeft,
          ySideTop,
          'L',
          xLeft,
          ySideBottom,
          'C',
          x,
          ySideBottom + cy,
          xCenter - cx,
          yCurveBottom,
          xCenter,
          yCurveBottom,
          'C',
          xCenter + cx,
          yCurveBottom,
          xRight,
          ySideBottom + cy,
          xRight,
          ySideBottom,
          'L',
          xRight,
          ySideTop,
          'C',
          xRight,
          ySideTop - cy,
          xCenter + cx,
          yCurveTop,
          xCenter,
          yCurveTop,
          'C',
          xCenter - cx,
          yCurveTop,
          xLeft,
          ySideTop - cy,
          xLeft,
          ySideTop,
          'Z',
        ]

        return { d: data.join(' ') }
      },
    },
  },
  knob: {
    enabled: true,
    position({ node }) {
      const lateral = node.attr<number>('body/lateral')
      return { x: 0, y: lateral }
    },
    onMouseMove({ node, data, deltaY }) {
      if (deltaY !== 0) {
        const bbox = node.getBBox()
        const previous = node.attr<number>('body/lateral')

        if (data.round == null) {
          data.round = previous
        }
        const min = 0
        const max = bbox.height / 2
        const current = NumberExt.clamp(data.round + deltaY, min, max)
        if (current !== previous) {
          node.attr({
            body: { lateral: current },
            top: {
              cy: current,
              ry: current,
            },
          })
        }
      }
    },
  },
})
