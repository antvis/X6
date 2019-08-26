import { detector } from './detector'

export const constants = {
  /**
   * Defines the portion of the cell which is to be used as a connectable
   * region. Default is 0.3. Possible values are 0 < x <= 1.
   */
  DEFAULT_HOTSPOT: 0.3,

  /**
   * Defines the minimum size in pixels of the portion of the cell which is
   * to be used as a connectable region. Default is 8.
   */
  MIN_HOTSPOT_SIZE: 8,

  /**
   * Defines the maximum size in pixels of the portion of the cell which is
   * to be used as a connectable region. Use 0 for no maximum. Default is 0.
   */
  MAX_HOTSPOT_SIZE: 0,

  RENDERING_HINT_EXACT: 'exact',
  RENDERING_HINT_FASTER: 'faster',
  RENDERING_HINT_FASTEST: 'fastest',

  DIALECT_SVG: 'svg',
  DIALECT_VML: 'vml',
  DIALECT_MIXEDHTML: 'mixedHtml',
  DIALECT_PREFERHTML: 'preferHtml',
  DIALECT_STRICTHTML: 'strictHtml',

  NS_SVG: 'http://www.w3.org/2000/svg',
  NS_XHTML: 'http://www.w3.org/1999/xhtml',
  NS_XLINK: 'http://www.w3.org/1999/xlink',

  SHADOWCOLOR: 'gray',
  SHADOW_OFFSET_X: 2,
  SHADOW_OFFSET_Y: 3,
  SHADOW_OPACITY: 1,

  TOOLTIP_VERTICAL_OFFSET: 16,

  DEFAULT_VALID_COLOR: '#00FF00',
  DEFAULT_INVALID_COLOR: '#FF0000',

  OUTLINE_HIGHLIGHT_COLOR: '#00FF00',
  OUTLINE_HIGHLIGHT_STROKEWIDTH: 5,

  HIGHLIGHT_STROKEWIDTH: 3,
  HIGHLIGHT_OPACITY: 100,
  HIGHLIGHT_COLOR: '#00FF00',
  CONSTRAINT_HIGHLIGHT_SIZE: 2,

  CURSOR_MOVABLE_VERTEX: 'move',
  CURSOR_MOVABLE_EDGE: 'move',
  CURSOR_LABEL_HANDLE: 'default',
  CURSOR_TERMINAL_HANDLE: 'pointer',
  CURSOR_BEND_HANDLE: 'crosshair',
  CURSOR_VIRTUAL_BEND_HANDLE: 'crosshair',
  CURSOR_CONNECT: 'pointer',

  /**
   * Defines the color to be used for highlighting a target cell for a new
   * or changed connection. Note that this may be either a source or
   * target terminal in the graph. Use 'none' for no color.
   * Default is #0000FF.
   */
  CONNECT_TARGET_COLOR: '#0000FF',

  /**
   * Defines the color to be used for highlighting a invalid target cells
   * for a new or changed connections. Note that this may be either a source
   * or target terminal in the graph. Use 'none' for no color. Default is
   * #FF0000.
   */
  INVALID_CONNECT_TARGET_COLOR: '#FF0000',

  /**
   * Defines the color to be used for the highlighting target parent cells
   * (for drag and drop). Use 'none' for no color. Default is #0000FF.
   */
  DROP_TARGET_COLOR: '#0000FF',

  /**
   * Defines the color to be used for the coloring valid connection
   * previews. Use 'none' for no color. Default is #FF0000.
   */
  VALID_COLOR: '#00FF00',

  /**
   * Defines the color to be used for the coloring invalid connection
   * previews. Use 'none' for no color. Default is #FF0000.
   */
  INVALID_COLOR: '#FF0000',

  /**
   * Defines the color to be used for the selection border of edges. Use
   * 'none' for no color. Default is #00FF00.
   */
  EDGE_SELECTION_COLOR: '#00FF00',

  /**
   * Defines the color to be used for the selection border of vertices. Use
   * 'none' for no color. Default is #00FF00.
   */
  VERTEX_SELECTION_COLOR: '#00FF00',

  /**
   * Defines the strokewidth to be used for vertex selections.
   * Default is 1.
   */
  VERTEX_SELECTION_STROKEWIDTH: 1,

  /**
   * Defines the strokewidth to be used for edge selections.
   * Default is 1.
   */
  EDGE_SELECTION_STROKEWIDTH: 1,

  /**
   * Defines the dashed state to be used for the vertex selection
   * border. Default is true.
   */
  VERTEX_SELECTION_DASHED: true,

  /**
   * Defines the dashed state to be used for the edge selection
   * border. Default is true.
   */
  EDGE_SELECTION_DASHED: true,

  /**
   * Defines the color to be used for the guidelines in mxGraphHandler.
   * Default is #FF0000.
   */
  GUIDE_COLOR: '#FF0000',

  /**
   * Defines the strokewidth to be used for the guidelines in mxGraphHandler.
   * Default is 1.
   */
  GUIDE_STROKEWIDTH: 1,

  /**
   * Defines the color to be used for the outline rectangle
   * border.  Use 'none' for no color. Default is #0099FF.
   */
  OUTLINE_COLOR: '#0099FF',

  /**
   * Defines the strokewidth to be used for the outline rectangle
   * stroke width. Default is 3.
   */
  OUTLINE_STROKEWIDTH: detector.IS_IE ? 2 : 3,

  /**
   * Defines the default size for handles. Default is 6.
   */
  HANDLE_SIZE: 6,

  /**
   * Defines the default size for label handles. Default is 4.
   */
  LABEL_HANDLE_SIZE: 4,

  /**
   * Defines the color to be used for the handle fill color. Use 'none' for
   * no color. Default is #00FF00 (green).
   */
  HANDLE_FILLCOLOR: '#00FF00',

  /**
   * Defines the color to be used for the handle stroke color. Use 'none' for
   * no color. Default is black.
   */
  HANDLE_STROKECOLOR: 'black',

  /**
   * Defines the color to be used for the label handle fill color. Use 'none'
   * for no color. Default is yellow.
   */
  LABEL_HANDLE_FILLCOLOR: 'yellow',

  /**
   * Defines the color to be used for the connect handle fill color. Use
   * 'none' for no color. Default is #0000FF (blue).
   */
  CONNECT_HANDLE_FILLCOLOR: '#0000FF',

  /**
   * Defines the color to be used for the locked handle fill color. Use
   * 'none' for no color. Default is #FF0000 (red).
   */
  LOCKED_HANDLE_FILLCOLOR: '#FF0000',

  /**
   * Defines the color to be used for the outline sizer fill color. Use
   * 'none' for no color. Default is #00FFFF.
   */
  OUTLINE_HANDLE_FILLCOLOR: '#00FFFF',

  /**
   * Defines the color to be used for the outline sizer stroke color. Use
   * 'none' for no color. Default is #0033FF.
   */
  OUTLINE_HANDLE_STROKECOLOR: '#0033FF',

  /**
   * Defines the default family for all fonts. Default is Arial,Helvetica.
   */
  DEFAULT_FONTFAMILY: 'Arial,Helvetica',

  /**
   * Defines the default size (in px). Default is 11.
   */
  DEFAULT_FONTSIZE: 11,

  /**
   * Defines the default value for the <STYLE_TEXT_DIRECTION> if no value is
   * defined for it in the style. Default value is an empty string which means
   * the default system setting is used and no direction is set.
   */
  DEFAULT_TEXT_DIRECTION: '',

  /**
   * Defines the default line height for text labels. Default is 1.2.
   */
  LINE_HEIGHT: 1.2,

  /**
   * Defines the CSS value for the word-wrap property. Default is "normal".
   * Change this to "break-word" to allow long words to be able to be broken
   * and wrap onto the next line.
   */
  WORD_WRAP: 'normal',

  /**
   * Specifies if absolute line heights should be used (px) in CSS. Default
   * is false. Set this to true for backwards compatibility.
   */
  ABSOLUTE_LINE_HEIGHT: false,

  /**
   * Defines the default style for all fonts. Default is 0. This can be set
   * to any combination of font styles as follows.
   */
  DEFAULT_FONTSTYLE: 0,

  /**
   * Defines the default start size for swimlanes. Default is 40.
   */
  DEFAULT_STARTSIZE: 40,

  /**
   * Defines the default size for all markers. Default is 6.
   */
  DEFAULT_MARKERSIZE: 6,

  /**
   * Defines the default width and height for images used in the
   * label shape. Default is 24.
   */
  DEFAULT_IMAGESIZE: 24,

  /**
   * Defines the length of the horizontal segment of an Entity Relation.
   * This can be overridden using <mxConstants.STYLE_SEGMENT> style.
   * Default is 30.
   */
  ENTITY_SEGMENT: 30,

  /**
   * Defines the rounding factor for rounded rectangles in percent between
   * 0 and 1. Values should be smaller than 0.5. Default is 0.15.
   */
  RECTANGLE_ROUNDING_FACTOR: 0.15,

  /**
   * Defines the size of the arcs for rounded edges. Default is 20.
   */
  LINE_ARCSIZE: 20,

  /**
   * Defines the spacing between the arrow shape and its terminals. Default is 0.
   */
  ARROW_SPACING: 0,

  /**
   * Defines the width of the arrow shape. Default is 30.
   */
  ARROW_WIDTH: 30,

  /**
   * Defines the size of the arrowhead in the arrow shape. Default is 30.
   */
  ARROW_SIZE: 30,

  NONE: 'none',
}
