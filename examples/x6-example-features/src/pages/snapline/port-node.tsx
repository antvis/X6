import { Shape } from '@antv/x6'

export const SNAP_PORT_RECT = 'snap-port-rect'

const PortAttrs = {
  circle: {
    r: 4,
    magnet: true,
    stroke: '#31d0c6',
    strokeWidth: 2,
    fill: '#fff',
  },
}

Shape.Rect.define({
  shape: SNAP_PORT_RECT,
  width: 100,
  height: 60,
  ports: {
    groups: {
      absolute: {
        position: 'absolute',
        args: { x: 0, y: 0 },
        attrs: PortAttrs,
      },
      top: {
        position: 'top',
        attrs: PortAttrs,
      },
      bottom: {
        position: 'bottom',
        attrs: PortAttrs,
      },
      left: {
        position: 'left',
        attrs: PortAttrs,
      },
      right: {
        position: 'right',
        attrs: PortAttrs,
      },
    },
  },
})
