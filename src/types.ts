import { Rectangle } from './struct'

export enum NodeType {
  element = 1,
  attribute = 2,
  text = 3,
  cdata = 4,
  entityReference = 5,
  entity = 6,
  processingInstruction = 7,
  comment = 8,
  document = 9,
  documentType = 10,
  documentFragment = 11,
  notation = 12,
}

export enum Align {
  left = 'left',
  center = 'center',
  right = 'right',
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
}

export enum Direction {
  north = 'north',
  south = 'south',
  east = 'east',
  west = 'west',
}

export enum LineCap {
  butt = 'butt',
  round = 'round',
  square = 'square',
}

export enum LineJoin {
  miter = 'miter',
  round = 'round',
  bevel = 'bevel',
}

export enum FontStyle {
  bold = 1,
  italic = 2,
  underlined = 4,
}

export namespace FontStyle {
  export function isBold(fontStyle: FontStyle) {
    return (fontStyle & FontStyle.bold) === FontStyle.bold
  }

  export function isItalic(fontStyle: FontStyle) {
    return (fontStyle & FontStyle.italic) === FontStyle.italic
  }

  export function isUnderlined(fontStyle: FontStyle) {
    return (fontStyle & FontStyle.underlined) === FontStyle.underlined
  }
}

export enum StyleNames {
  perimeter = 'perimeter',
  sourcePort = 'sourcePort',
  targetPort = 'targetPort',

  /**
   * The direction(s) that edges are allowed to connect to cells in.
   */
  portConstraint = 'portConstraint',
  sourcePortConstraint = 'sourcePortConstraint',
  targetPortConstraint = 'targetPortConstraint',

  /**
   * Define whether port constraint directions are rotated with vertex
   * rotation. 0 (default) causes port constraints to remain absolute,
   * relative to the graph, 1 causes the constraints to rotate with
   * the vertex.
   */
  portConstraintRotation = 'portConstraintRotation',

  opacity = 'opacity',
  fillOpacity = 'fillOpacity',
  strokeOpacity = 'strokeOpacity',
  textOpacity = 'textOpacity',
  textDirection = 'textDirection',
  overflow = 'overflow',
  /**
   * Defines if the connection points on either end of the edge should be
   * computed so that the edge is vertical or horizontal if possible and
   * if the point is not at a fixed location.
   */
  orthogonal = 'orthogonal',

  /**
   * Defines the key for the horizontal relative coordinate connection
   * point of an edge with its source terminal.
   */
  exitX = 'exitX',

  /**
   * Defines the key for the vertical relative coordinate connection
   * point of an edge with its source terminal.
   */
  exitY = 'exitY',

  /**
   * Defines the key for the horizontal offset of the connection point
   * of an edge with its source terminal.
   */
  exitDx = 'exitDx',

  /**
   * Defines the key for the vertical offset of the connection point
   * of an edge with its source terminal.
   */
  exitDy = 'exitDy',

  /**
   * Defines the key for the horizontal relative coordinate connection
   * point of an edge with its target terminal.
   */
  entryX = 'entryX',

  /**
   * Defines the key for the vertical relative coordinate connection
   * point of an edge with its target terminal.
   */
  entryY = 'entryY',

  /**
   * Defines the key for the horizontal offset of the connection point
   * of an edge with its target terminal.
   */
  entryDx = 'entryDx',

  /**
   * Defines the key for the vertical offset of the connection point
   * of an edge with its target terminal.
   */
  entryDy = 'entryDy',

  /**
   * Defines if the perimeter should be used to find the exact entry point
   * along the perimeter of the source. Possible values are `false` and
   * `true`. Default is `true`.
   */
  exitPerimeter = 'exitPerimeter',

  /**
   * Defines if the perimeter should be used to find the exact entry point
   * along the perimeter of the target. Possible values are `false` and
   * `true`. Default is `true`.
   */
  entryPerimeter = 'entryPerimeter',
  whiteSpace = 'whiteSpace', // nowrap, wrap
  rotation = 'rotation',
  fillColor = 'fillColor',
  pointerEvents = 'pointerEvents',
  swimlaneFillColor = 'swimlaneFillColor',
  margin = 'margin',
  gradientColor = 'gradientColor',
  gradientDirection = 'gradientDirection',
  strokeColor = 'strokeColor',
  separatorColor = 'separatorColor',
  strokeWidth = 'strokeWidth',
  align = 'align',
  verticalAlign = 'verticalAlign',
  labelWidth = 'labelWidth',
  labelPosition = 'labelPosition',
  verticalLabelPosition = 'verticalLabelPosition',
  imageAspect = 'imageAspect',
  imageAlign = 'imageAlign',
  imageVerticalAlign = 'imageVerticalAlign',
  glass = 'glass',
  image = 'image',
  imageWidth = 'imageWidth',
  imageHeight = 'imageHeight',
  imageBackground = 'imageBackground',
  imageBorder = 'imageBorder',
  flipH = 'flipH',
  flipV = 'flipV',
  noLabel = 'noLabel',
  noEdgeStyle = 'noEdgeStyle',
  labelBackgroundColor = 'labelBackgroundColor',
  labelBorderColor = 'labelBorderColor',
  labelPadding = 'labelPadding',

  indicatorShape = 'indicatorShape',
  indicatorImage = 'indicatorImage',
  indicatorColor = 'indicatorColor',
  indicatorStrokeColor = 'indicatorStrokeColor',
  indicatorGradientColor = 'indicatorGradientColor',
  indicatorSpacing = 'indicatorSpacing',
  indicatorWidth = 'indicatorWidth',
  indicatorHeight = 'indicatorHeight',
  indicatorDirection = 'indicatorDirection',

  shadow = 'shadow',
  segment = 'segment',
  endArrow = 'endArrow',
  startArrow = 'startArrow',
  endSize = 'endSize',
  startSize = 'startSize',
  swimlaneLine = 'swimlaneLine',
  endFill = 'endFill',
  startFill = 'startFill',
  dashed = 'dashed',
  dashPattern = 'dashPattern',
  fixDash = 'fixDash',
  rounded = 'rounded',
  curved = 'curved',
  arcSize = 'arcSize',
  absoluteArcSize = 'absoluteArcSize',
  sourcePerimeterSpacing = 'sourcePerimeterSpacing',
  targetPerimeterSpacing = 'targetPerimeterSpacing',
  perimeterSpacing = 'perimeterSpacing',
  spacing = 'spacing',
  spacingTop = 'spacingTop',
  spacingLeft = 'spacingLeft',
  spacingBottom = 'spacingBottom',
  spacingRight = 'spacingRight',
  horizontal = 'horizontal',
  direction = 'direction',

  /**
   * Defines the key for the anchorPointDirection style. The defines if the
   * direction style should be taken into account when computing the fixed
   * point location for connected edges. Default is 1. Set this to 0
   * to ignore the direction style for fixed connection points.
   */
  anchorPointDirection = 'anchorPointDirection',
  elbow = 'elbow',

  fontColor = 'fontColor',
  fontFamily = 'fontFamily',
  fontSize = 'fontSize',
  fontStyle = 'fontStyle',

  aspect = 'aspect',
  autosize = 'autosize',
  foldable = 'foldable',
  editable = 'editable',
  backgroundOutline = 'backgroundOutline',
  bendable = 'bendable',
  movable = 'movable',
  resizable = 'resizable',
  resizeWidth = 'resizeWidth',
  resizeHeight = 'resizeHeight',
  rotatable = 'rotatable',
  cloneable = 'cloneable',
  deletable = 'deletable',
  shape = 'shape',
  edgeStyle = 'edgeStyle',
  jettySize = 'jettySize',
  sourceJettySize = 'sourceJettySize',
  targetJettySize = 'targetJettySize',
  loopStyle = 'loopStyle',
  orthogonalLoop = 'orthogonalLoop',
  routingCenterX = 'routingCenterX',
  routingCenterY = 'routingCenterY',
}

export enum ShapeNames {
  rectangle = 'rectangle',
  ellipse = 'ellipse',
  doubleEllipse = 'doubleEllipse',
  rhombus = 'rhombus',
  line = 'line',
  image = 'image',
  label = 'label',
  cylinder = 'cylinder',
  swimlane = 'swimlane',
  connector = 'connector',
  actor = 'actor',
  cloud = 'cloud',
  triangle = 'triangle',
  hexagon = 'hexagon',
  arrow = 'arrow',
  arrowConnector = 'arrowConnector',
  arrowClassic = 'classic',
  arrowClassicThin = 'classicThin',
  arrowBlock = 'block',
  arrowBlockThin = 'blockThin',
  arrowOpen = 'open',
  arrowOpenThin = 'openThin',
  arrowOval = 'oval',
  arrowDiamond = 'diamond',
  arrowDiamondThin = 'diamondThin',
}

export enum TextDirection {
  default = '',
  auto = 'auto',
  ltr = 'ltr',
  rtl = 'rtl',
}

export enum DirectionMask {
  none = 0,
  west = 1,
  north = 2,
  south = 4,
  east = 8,
  all = 15,
}

export enum EdgeStyleNames {
  elbowEdgeStyle = 'elbowEdgeStyle',
  entityRelationEdgeStyle = 'entityRelationEdgeStyle',
  loopEdgeStyle = 'loopEdgeStyle',
  sideToSideEdgeStyle = 'sideToSideEdgeStyle',
  topToBottomEdgeStyle = 'topToBottomEdgeStyle',
  orthogonalEdgeStyle = 'orthogonalEdgeStyle',
  segmentEdgeStyle = 'segmentEdgeStyle',
}

export enum PerimeterNames {
  ellipse = 'ellipsePerimeter',
  rectangle = 'rectanglePerimeter',
  rhombus = 'rhombusPerimeter',
  hexagon = 'hexagonPerimeter',
  triangle = 'trianglePerimeter',
}

export namespace PageFormat {
  export const A4_PORTRAIT = new Rectangle(0, 0, 827, 1169)
  export const A4_LANDSCAPE = new Rectangle(0, 0, 1169, 827)
  export const LETTER_PORTRAIT = new Rectangle(0, 0, 850, 1100)
  export const LETTER_LANDSCAPE = new Rectangle(0, 0, 1100, 850)
}
