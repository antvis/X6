import { Graph } from './graph'
import { Perimeter } from '../stylesheet'
import { Shapes } from '../struct'
import { Style } from '../types'

const commonStyle: Style = {
  align: 'center',
  verticalAlign: 'middle',
  fontColor: 'rgba(0, 0, 0, 0.65)',
}

export const defaultOptions: Graph.Options = {
  prefixCls: 'x6',
  dialect: 'svg',
  nativeDblClickEnabled: true,
  doubleTapEnabled: true,
  doubleTapTimeout: 500,
  doubleTapTolerance: 25,
  tapAndHoldEnabled: true,
  tapAndHoldDelay: 500,

  nodeStyle: {
    ...commonStyle,
    shape: Shapes.rectangle,
    perimeter: Perimeter.rectangle,
    fill: '#f6edfc',
    stroke: '#712ed1',
  },

  edgeStyle: {
    ...commonStyle,
    shape: Shapes.connector,
    endArrow: Shapes.arrowClassic,
    stroke: '#8f8f8f',
  },

  grid: {
    enabled: true,
    size: 10,
  },

  guide: {
    enabled: false,
    rounded: false,
    dashed: false,
    stroke: '#1890ff',
    strokeWidth: 1,
    horizontal: {
      enabled: true,
    },
    vertical: {
      enabled: true,
    },
  },

  tooltip: {
    enabled: false,
  },

  rubberband: {
    enabled: false,
    fadeOut: false,
    border: '1px solid #0000ff',
    background: '#0077ff',
    opacity: 0.2,
  },
}
