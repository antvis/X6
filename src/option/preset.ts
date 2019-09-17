import * as images from '../assets/images'
import { loop } from '../router'
import { Style } from '../types'
import { rectangle } from '../perimeter'
import { FullOptions } from './graph'
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
    scaled: false,
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
    fill: '#fff',
    stroke: '#000',
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
    dashed: true,
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
    delay: 500,
    zIndex: 9999,
    hideOnHover: false,
    ignoreTouchEvents: true,
  },

  rubberband: {
    enabled: false,
    fadeOut: false,
    border: '1px solid #108ee9',
    background: '#0077ff',
    opacity: 0.2,
  },

  contextMenu: {
    enabled: false,
    isLeftButton: false,
    selectCellsOnContextMenu: true,
    clearSelectionOnBackground: true,
  },

  movingPreview: {
    html: false,
    minimumSize: 6,
    opacity: 1,
    dashed: true,
    stroke: '#000',
    strokeWidth: 1,
    fill: 'none',
    cursor: 'move',
  },

  selectionPreview: {
    opacity: 1,
    stroke: '#108ee9',
    strokeWidth: 1,
    dashed: true,
    fill: 'none',
  },

  resize: {
    enabled: true,
    centered: false,
    livePreview: false,
    manageHandles: false,
  },

  resizeHandle: {
    single: false,
    shape: 'ellipse',
    size: 8,
    opacity: 1,
    fill: '#108ee9',
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
  },

  resizePreview: {
    opacity: 1,
    stroke: '#108ee9',
    strokeWidth: 1,
    dashed: true,
    fill: 'rgba(24, 144, 255, 0.05)',
  },

  rotate: {
    enabled: false,
    rasterized: true,
    livePreview: false,
  },

  rotateHandle: {
    image: images.rotate,
    shape: 'ellipse',
    size: 10,
    opacity: 1,
    fill: '#108ee9',
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
    cursor: 'crosshair',
    offset: { x: 0, y: -20 },
  },

  rotatePreview: {
    opacity: 1,
    stroke: '#108ee9',
    strokeWidth: 1,
    dashed: true,
    fill: 'rgba(24, 144, 255, 0.05)',
  },

  labelHandle: {
    shape: 'ellipse',
    size: 10,
    opacity: 1,
    fill: 'rgba(24,144,255,1)',
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
    cursor: 'move',
    offset: { x: 0, y: -8 },
  },
}
