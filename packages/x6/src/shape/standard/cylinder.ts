import { NumberExt } from '../../util'
import { bodyAttr } from './util'
import { Base } from '../base'
import { Angle } from '../../geometry'

const CYLINDER_TILT = 10

export const Cylinder = Base.define({
  shape: 'cylinder',
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
      ...bodyAttr,
      lateral: CYLINDER_TILT,
    },
    top: {
      ...bodyAttr,
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
          // tslint:disable-next-line
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
    update({ node, knob }) {
      const ctm = this.matrix()
      const bbox = node.getBBox()
      const lateral = node.attr<number>('body/lateral')
      const left = bbox.x * ctm.a + ctm.e
      const top = (bbox.y + lateral) * ctm.d + ctm.f
      const angle = Angle.normalize(node.getAngle())
      const transform = angle !== 0 ? `rotate(${angle}deg)` : ''
      const style = knob.container.style
      style.transform = transform
      style.left = `${left}px`
      style.top = `${top}px`
    },
    onMouseMove({ e, node, data }) {
      const y = e.clientY
      if (data.lastY == null) {
        data.lastY = y
        return
      }

      const dy = y - data.lastY
      if (dy !== 0) {
        const ctm = this.matrix()
        const bbox = node.getBBox()
        const previous = node.attr<number>('body/lateral')
        const delta = dy / ctm.d
        const min = 0
        const max = bbox.height / 2
        const current = NumberExt.clamp(previous + delta, min, max)
        if (current !== previous) {
          node.attr({
            body: { lateral: current },
            top: {
              cy: current,
              ry: current,
            },
          })
          data.lastY = y
        }
      }
    },
  },
})
