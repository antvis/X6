export enum StyleName {
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
   * along the perimeter of the source. Possible values are `false`(0) and
   * `true`(1).
   *
   * Default is `true`(1).
   */
  exitPerimeter = 'exitPerimeter',

  /**
   * Defines if the perimeter should be used to find the exact entry point
   * along the perimeter of the target. Possible values are `false`(0) and
   * `true`(1).
   *
   * Default is `true`(1).
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
