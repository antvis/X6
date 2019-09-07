import { Graph } from './graph'

export const defaultOptions: Graph.Options = {
  prefixCls: 'x6',
  dialect: 'svg',
  nativeDblClickEnabled: true,
  doubleTapEnabled: true,
  doubleTapTimeout: 500,
  doubleTapTolerance: 25,
  tapAndHoldEnabled: true,
  tapAndHoldDelay: 500,

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
