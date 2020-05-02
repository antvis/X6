import { NumberExt } from '../../util'
import { NodeRegistry } from '../../registry'
import { bodyAttr, labelAttr } from './util'

const CYLINDER_TILT = 10

export const Cylinder = NodeRegistry.register('cylinder', {
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
      lateralArea: CYLINDER_TILT,
    },
    top: {
      ...bodyAttr,
      refCx: '50%',
      refRx: '50%',
      cy: CYLINDER_TILT,
      ry: CYLINDER_TILT,
    },
    label: {
      ...labelAttr,
      refX: '50%',
      refY: '100%',
      refY2: 15,
    },
  },
  attrDefinitions: {
    lateralArea: {
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
})
