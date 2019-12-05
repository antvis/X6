export interface GlobalConfig {
  trackable: boolean
  trackInfo: { [key: string]: any }
  defaultShadowColor: string
  defaultShadowOffsetX: number
  defaultShadowOffsetY: number
  defaultShadowOpacity: number

  /**
   * Defines the default style for all fonts.
   *
   * Default is `0`.
   */
  defaultFontStyle: number

  /**
   * Defines the default size for all fonts.
   *
   * Default is `12`.
   */
  defaultFontSize: number

  /**
   * Defines the default family for all fonts.
   *
   * Default is `Arial,Helvetica`.
   */
  defaultFontFamily: string

  /**
   * Defines the default color for all fonts.
   *
   * Default is `#000000`.
   */
  defaultFontColor: string
  defaultLineHeight: number
  defaultAbsoluteLineHeight: boolean

  /**
   * Defines the default start size for swimlanes.
   *
   * Default is `40`.
   */
  defaultStartSize: number

  /**
   * Defines the default size for all markers.
   *
   * Default is `6`.
   */
  defaultMarkerSize: number

  /**
   * Defines the default width and height for images used in the
   * label shape.
   *
   * Default is `24`.
   */
  defaultImageSize: number

  /**
   * Defines the length of the horizontal segment of an Entity Relation.
   *
   * Default is `30`.
   */
  defaultSegmentLength: number

  /**
   * Defines the rounding factor for rounded rectangles in percent between
   * `0` and `1`. Values should be smaller than `0.5`.
   *
   * Default is `0.15`.
   */
  rectangleRoundFactor: number

  /**
   * Defines the size of the arcs for rounded edges.
   *
   * Default is `20`.
   */
  defaultLineArcSize: number

  /**
   * Defines the spacing between the arrow shape and its terminals.
   *
   * Default is `0`.
   */
  defaultArrowSpacing: number

  /**
   * Defines the width of the arrow shape.
   *
   * Default is `30`.
   */
  defaultArrowWidth: number

  /**
   * Defines the size of the arrowhead in the arrow shape.
   *
   * Default is `30`.
   */
  defaultArrowSize: number

  defaultPrimaryColor: string
  defaultValidColor: string
  defaultInvalidColor: string
  defaultCursorMove: string
  defaultCursorCross: string
  defaultCursorPointer: string
}

export const globals: GlobalConfig = {
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
  defaultPrimaryColor: '#1890ff',
  defaultValidColor: '#2ddb73',
  defaultInvalidColor: '#f5222d',
  defaultCursorMove: 'move',
  defaultCursorCross: 'crosshair',
  defaultCursorPointer: 'pointer',
}
