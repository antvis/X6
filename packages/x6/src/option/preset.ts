import { Platform } from '../util'
import * as images from '../assets/images'
import { loop } from '../route/loop'
import { Style } from '../types'
import { PageSize } from '../enum'
import { Perimeter } from '../perimeter'
import { FullOptions } from './rollup'
import { globals } from './global'

const commonStyle: Style = {
  align: 'center',
  verticalAlign: 'middle',
  fontColor: 'rgba(0, 0, 0, 1)',
}

export const preset: FullOptions = {
  ...globals,
  prefixCls: 'x6',
  dialect: 'svg',
  infinite: false,
  antialiased: true,
  border: 0,
  backgroundColor: '#ffffff',
  warningImage: images.warning,
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
    stroke: '#808080',
    dsahed: true,
    minDist: 20,
  },

  pageVisible: false,
  preferPageSize: false,
  pageFormat: PageSize.A4_PORTRAIT,
  pageScale: 1,
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
  autoResizeContainer: false,
  invokesStopCellEditing: true,
  stopEditingOnEnter: false,
  cellsExportable: true,
  cellsImportable: true,
  portsEnabled: true,

  grid: {
    enabled: true,
    visible: true,
    size: 10,
    minSize: 4,
    scaled: false,
    step: 4,
    type: 'line',
    color: '#e0e0e0',
  },

  tolerance: 4,
  swimlaneNesting: true,
  swimlaneSelectionEnabled: true,
  multigraphSupported: true,
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
  maxCellCountForHandle: Platform.IS_IE ? 20 : 50,

  nodeStyle: {
    ...commonStyle,
    shape: 'rectangle',
    perimeter: Perimeter.rectangle,
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
    stroke: globals.defaultPrimaryColor,
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

  mouseWheel: {
    enabled: false,
    modifiers: ['alt', 'ctrl', 'meta'],
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
    cursor: globals.defaultCursorMove,
  },

  selectionPreview: {
    opacity: 1,
    stroke: globals.defaultPrimaryColor,
    strokeWidth: 1,
    dashed: true,
    fill: 'none',
    cursor: ({ cell }) =>
      cell.isNode() || cell.isEdge() ? globals.defaultCursorMove : '',
    highlightParent: false,
  },

  resize: {
    enabled: true,
    centered: false,
    livePreview: false,
    constrainByChildren: true,
  },

  resizeHandle: {
    single: false,
    adaptive: true,
    tolerance: 4,
    visible: true,
    shape: 'ellipse',
    size: 8,
    opacity: 1,
    fill: globals.defaultPrimaryColor,
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
  },

  resizePreview: {
    opacity: 1,
    stroke: globals.defaultPrimaryColor,
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
    fill: globals.defaultPrimaryColor,
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
    cursor: globals.defaultCursorCross,
    offset: { x: 0, y: -20 },
  },

  rotatePreview: {
    opacity: 1,
    stroke: globals.defaultPrimaryColor,
    strokeWidth: 1,
    dashed: true,
    fill: 'rgba(24, 144, 255, 0.05)',
  },

  labelHandle: {
    shape: 'ellipse',
    size: 10,
    opacity: 1,
    fill: globals.defaultPrimaryColor,
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
    cursor: globals.defaultCursorMove,
    offset: { x: 0, y: -8 },
  },

  anchor: {
    // image: images.cross,
    shape: 'ellipse',
    size: 6,
    opacity: 0.8,
    fill: '#fff',
    stroke: globals.defaultPrimaryColor,
    strokeWidth: 2,
    dashed: false,
    cursor: globals.defaultCursorPointer,
    inductiveSize: 20,
    adsorbNearestTarget: true,
  },

  anchorTip: {
    enabled: false,
    shape: 'ellipse',
    size: 12,
    opacity: 0.3,
    fill: 'none',
    stroke: globals.defaultPrimaryColor,
    strokeWidth: 6,
    dashed: false,
  },

  anchorHighlight: {
    shape: 'ellipse',
    cursor: globals.defaultCursorPointer,
    opacity: 0.3,
    fill: 'none',
    stroke: globals.defaultValidColor,
    strokeWidth: 8,
    dashed: false,
  },

  connection: {
    enabled: false,
    autoSelect: true,
    autoCreateTarget: false,
    waypointsEnabled: false,
    ignoreMouseDown: false,
    livePreview: false,
    insertBeforeSource: false,
    cursor: globals.defaultCursorPointer,

    hotspotable: true,
    hotspotRate: 0.3,
    minHotspotSize: 8,
    maxHotspotSize: 0,
  },

  connectionIcon: {
    // image: images.rotate,
    toFront: false,
    toBack: false,
    centerTarget: false,
    cursor: globals.defaultCursorPointer,
    offset: { x: 0, y: 16 },
  },

  connectionPreview: {
    opacity: 1,
    fill: 'none',
    dashed: ({ livePreview }) => (livePreview ? false : true),
    strokeWidth: ({ livePreview }) => (livePreview ? 1 : 2),
    stroke: ({ valid }) =>
      valid ? globals.defaultPrimaryColor : globals.defaultInvalidColor,
  },

  connectionHighlight: {
    validColor: globals.defaultValidColor,
    invalidColor: globals.defaultInvalidColor,
    strokeWidth: 3,
    dashed: false,
    spacing: 2,
    opacity: 0.3,
    keepOnTop: false,
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
    fill: globals.defaultPrimaryColor,
    stroke: '#fff',
    strokeWidth: 1,
    dashed: false,
    opacity: ({ visual }) => (visual ? 0.2 : 1),
    cursor: ({ isSource, isTarget, visual }) =>
      (isSource || isTarget) && visual !== true
        ? globals.defaultCursorPointer
        : globals.defaultCursorCross,
  },
}
