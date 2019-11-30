import * as images from '../assets/images'
import { Style } from '../types'
import { detector } from '../common'
import { PageSize } from '../struct'
import { FullOptions } from './graph'
import { loop } from '../route/loop'
import { rectanglePerimeter } from '../perimeter/rectangle'

const commonStyle: Style = {
  align: 'center',
  verticalAlign: 'middle',
  fontColor: 'rgba(0, 0, 0, 1)',
}

export const COLOR_PRIMARY = '#1890ff'
export const COLOR_VALID = '#2ddb73'
export const COLOR_INVALID = '#f5222d'
export const CURSOR_MOVE = 'move'
export const CURSOR_CROSS = 'crosshair'
export const CURSOR_POINTER = 'pointer'

export const preset: FullOptions = {
  // global config
  trackable: true,
  trackInfo: {},
  defaultShadowColor: '#808080',
  defaultShadowOffsetX: 2,
  defaultShadowOffsetY: 3,
  defaultShadowOpacity: 1,
  defaultFontSize: 12,
  defaultFontStyle: 0,
  defaultFontColor: '#000000',
  defaultFontFamily: 'Arial,Helvetica',
  defaultLineHeight: 1.2,
  defaultAbsoluteLineHeight: false,
  defaultStartSize: 40,
  defaultMarkerSize: 6,
  defaultImageSize: 24,
  defaultSegmentLength: 30,
  rectangleRoundFactor: 0.15,
  defaultLineArcSize: 20,
  defaultArrowSpacing: 0,
  defaultArrowSize: 30,
  defaultArrowWidth: 30,

  //
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
  pageScale: 1,
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
  scaleFactor: 1.2,
  minScale: 0.01,
  maxScale: 16,
  useScrollbarsForPanning: true,
  keepSelectionVisibleOnZoom: false,
  centerZoom: true,
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
  connectOnDrop: false,
  dropEnabled: false,
  splitEnabled: true,
  autoUpdateCursor: true,
  allowRemoveCellsFromParent: true,
  autoRemoveEmptyParent: true,
  scrollOnMove: true,
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
  maxCellCountForHandle: detector.IS_IE ? 20 : 50,

  nodeStyle: {
    ...commonStyle,
    shape: 'rectangle',
    perimeter: rectanglePerimeter,
    fill: '#fff',
    stroke: '#000',
  },

  edgeStyle: {
    ...commonStyle,
    shape: 'connector',
    endArrow: 'classic',
    stroke: '#888',
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

  contextMenu: {
    enabled: false,
    isLeftButton: false,
    selectCellsOnContextMenu: true,
    clearSelectionOnBackground: true,
  },

  keyboard: {
    enabled: false,
    global: false,
    escape: true,
  },

  rubberband: {
    enabled: false,
    fadeOut: false,
    border: '1px solid #1890ff',
    background: '#0077ff',
    opacity: 0.2,
  },

  dropTargetHighlight: {
    stroke: '#0000FF',
    strokeWidth: 3,
    dashed: false,
    opacity: 0.3,
    spacing: 2,
  },

  movingPreview: {
    html: false,
    scaleGrid: false,
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
    cursor: ({ cell }) => (cell.isNode() || cell.isEdge() ? CURSOR_MOVE : ''),
  },

  resize: {
    enabled: true,
    centered: false,
    livePreview: false,
  },

  resizeHandle: {
    single: false,
    adaptive: true,
    tolerance: 4,
    visible: true,
    shape: 'ellipse',
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
  },

  rotateHandle: {
    image: images.rotate,
    shape: 'ellipse',
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
    shape: 'ellipse',
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
    shape: 'ellipse',
    cursor: CURSOR_POINTER,
    opacity: 0.3,
    fill: 'none',
    stroke: COLOR_VALID,
    strokeWidth: 10,
    dashed: false,
  },

  connection: {
    enabled: false,
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

  edgeHandle: {
    cloneable: false,
    addable: false,
    removable: false,
    dblClickRemoveEnabled: false,
    mergeRemoveEnabled: false,
    straightRemoveEnabled: false,
    virtualHandlesEnabled: false,
    manageLabelHandle: false,
    // handle style
    shape: 'ellipse',
    size: 8,
    fill: COLOR_PRIMARY,
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
    opacity: ({ visual }) => (visual ? 0.2 : 1),
    cursor: ({ isSource, isTarget, visual }) =>
      (isSource || isTarget) && visual !== true ? CURSOR_POINTER : CURSOR_CROSS,
  },
}
