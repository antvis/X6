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

export const COLOR_PRIMARY = '#1890ff'
export const COLOR_VALID = '#2ddb73'
export const COLOR_INVALID = '#f5222d'
export const CURSOR_MOVE = 'move'
export const CURSOR_CROSS = 'crosshair'
export const CURSOR_POINTER = 'pointer'

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
    stroke: COLOR_PRIMARY,
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
    border: '1px solid #1890ff',
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
    cursor: CURSOR_MOVE,
  },

  selectionPreview: {
    opacity: 1,
    stroke: COLOR_PRIMARY,
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
    visible: true,
    shape: ShapeNames.ellipse,
    size: 8,
    opacity: 1,
    fill: COLOR_PRIMARY,
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
  },

  resizePreview: {
    opacity: 1,
    stroke: COLOR_PRIMARY,
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
    shape: ShapeNames.ellipse,
    size: 10,
    opacity: 1,
    fill: COLOR_PRIMARY,
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
    cursor: CURSOR_CROSS,
    offset: { x: 0, y: -20 },
  },

  rotatePreview: {
    opacity: 1,
    stroke: COLOR_PRIMARY,
    strokeWidth: 1,
    dashed: true,
    fill: 'rgba(24, 144, 255, 0.05)',
  },

  labelHandle: {
    shape: ShapeNames.ellipse,
    size: 10,
    opacity: 1,
    fill: COLOR_PRIMARY,
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
    cursor: CURSOR_MOVE,
    offset: { x: 0, y: -8 },
  },

  constraint: {
    image: images.cross,
    cursor: CURSOR_POINTER,
  },

  constraintHighlight: {
    shape: ShapeNames.ellipse,
    cursor: CURSOR_POINTER,
    opacity: 0.3,
    fill: 'none',
    stroke: COLOR_VALID,
    strokeWidth: 10,
    dashed: false,
  },

  connection: {
    autoSelect: true,
    autoCreateTarget: false,
    waypointsEnabled: false,
    ignoreMouseDown: false,
    outlineConnect: false,
    livePreview: false,
    insertBeforeSource: false,
    cursor: CURSOR_POINTER,
  },

  connectionIcon: {
    // image: images.rotate,
    toFront: false,
    toBack: false,
    centerTarget: false,
    cursor: CURSOR_POINTER,
    offset: { x: 0, y: 16 },
  },

  connectionHighlight: {
    validColor: COLOR_VALID,
    invalidColor: COLOR_INVALID,
    strokeWidth: 3,
    dashed: false,
    spacing: 2,
    opacity: 0.3,
    keepOnTop: false,

    hotspotable: true,
    hotspot: 0.3,
    maxHotspotSize: 0,
    minHotspotSize: 8,
  },

  connectionPreview: {
    opacity: 1,
    fill: 'none',
    dashed: true,
    strokeWidth: 2,
    stroke: ({ valid }) => (valid ? COLOR_VALID : COLOR_INVALID),
  },
}
