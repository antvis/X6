import * as images from '../assets/images'
import { loop } from '../router'
import { Style } from '../types'
import { rectangle } from '../perimeter'
import { FullOptions } from './option'
import { ShapeNames, MarkerNames, PageSize } from '../struct'

const commonStyle: Style = {
  align: 'center',
  verticalAlign: 'middle',
  fontColor: 'rgba(0, 0, 0, 0.65)',
}

export const defaultOptions: FullOptions = {
  prefixCls: 'x6',
  dialect: 'svg',
  antialiased: true,
  multiplicities: [],
  alternateEdgeStyle: null,
  nativeDblClickEnabled: true,
  doubleTapEnabled: true,
  doubleTapTimeout: 500,
  doubleTapTolerance: 25,
  tapAndHoldEnabled: true,
  tapAndHoldDelay: 500,

  pageBreak: {
    enabled: false,
    stroke: 'gray',
    dsahed: true,
    minDist: 20,
  },

  pageVisible: false,
  preferPageSize: false,
  pageFormat: PageSize.A4_PORTRAIT,
  pageScale: 1.5,
  backgroundImage: null,
  autoScroll: true,
  ignoreScrollbars: false,
  translateToScrollPosition: false,
  timerAutoScroll: false,
  allowAutoPanning: false,
  autoExtend: true,
  maxGraphBounds: null,
  minGraphSize: null,
  minContainerSize: null,
  maxContainerSize: null,
  keepEdgesInForeground: false,
  keepEdgesInBackground: false,
  resetViewOnRootChange: true,
  resetEdgesOnResize: false,
  resetEdgesOnMove: false,
  resetEdgesOnConnect: true,
  defaultLoopRouter: loop,
  swimlaneIndicatorColorAttribute: 'fill',
  minFitScale: 0.1,
  maxFitScale: 8,
  useScrollbarsForTranslate: true,
  keepSelectionVisibleOnZoom: false,
  centerZoom: true,
  zoomFactor: 1.2,
  cellsLocked: false,
  cellsCloneable: true,
  cellsSelectable: true,
  cellsDeletable: true,
  nodeLabelsMovable: false,
  edgeLabelsMovable: true,
  cellsMovable: true,
  cellsResizable: true,
  cellsBendable: true,
  cellsEditable: true,
  cellsDisconnectable: true,

  folding: {
    enabled: true,
    collapsedImage: images.collapsed,
    expandedImage: images.expanded,
  },

  htmlLabels: false,
  labelsVisible: true,
  border: 0,
  autoResizeContainer: false,
  escapeEnabled: true,
  invokesStopCellEditing: true,
  stopEditingOnPressEnter: false,
  exportEnabled: true,
  importEnabled: true,
  portsEnabled: true,

  grid: {
    enabled: true,
    size: 10,
  },

  tolerance: 4,
  swimlaneNesting: true,
  swimlaneSelectionEnabled: true,
  multigraph: true,
  allowLoops: false,
  allowDanglingEdges: true,
  edgesConnectable: false,
  invalidEdgesClonable: false,
  disconnectOnMove: true,
  dropEnabled: false,
  splitEnabled: true,
  autoSizeOnAdded: false,
  autoSizeOnEdited: false,
  extendParents: true,
  extendParentsOnAdd: true,
  extendParentsOnMove: false,
  recursiveResize: false,
  constrainChildren: true,
  constrainRelativeChildren: false,
  allowNegativeCoordinates: true,
  defaultOverlap: 0.5,

  nodeStyle: {
    ...commonStyle,
    shape: ShapeNames.rectangle,
    perimeter: rectangle,
    fill: '#f6edfc',
    stroke: '#712ed1',
  },

  edgeStyle: {
    ...commonStyle,
    shape: ShapeNames.connector,
    endArrow: MarkerNames.classic,
    stroke: '#8f8f8f',
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
