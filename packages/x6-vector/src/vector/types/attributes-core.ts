import {
  AriaAttributes,
  CSSProperties,
  CustomAttributes,
} from '../../dom/types/attributes-core'

export * from '../../dom/types/attributes-core'

export interface SVGCoreAttributes<T> extends CustomAttributes<T> {
  /**
   * The `id` attribute assigns a unique name to an element.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/id](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/id)
   */
  id?: string
  /**
   * The `tabindex` attribute allows you to control whether an element is
   * focusable and to define the relative order of the element for the purposes
   * of sequential focus navigation.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/tabindex](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/tabindex)
   */
  tabIndex?: number
  /**
   * The `lang` attribute specifies the primary language used in contents and
   * attributes containing text content of particular elements.
   *
   * There is also an `xml:lang` attribute (with namespace). If both of them
   * are defined, the one with namespace is used and the one without is ignored.
   *
   * In SVG 1.1 there was a lang attribute defined with a different meaning and
   * only applying to `<glyph>` elements. That attribute specified a list of
   * languages in BCP 47 format. The glyph was meant to be used if the `xml:lang`
   * attribute exactly matched one of the languages given in the value of this
   * parameter, or if the `xml:lang` attribute exactly equaled a prefix of one
   * of the languages given in the value of this parameter such that the first
   * tag character following the prefix was "-".
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/lang](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/lang)
   */
  lang?: string
  xmlBase?: string
  xmlLang?: string
  xmlSpace?: string
  role?: string
}

export interface SVGStyleAttributes {
  /**
   * Assigns a class name or set of class names to an element. You may assign
   * the same class name or names to any number of elements, however, multiple
   * class names must be separated by whitespace characters.
   *
   * An element's class name serves two key roles:
   * - As a style sheet selector, for when an author assigns style information
   * to a set of elements.
   * - For general use by the browser.
   *
   * You can use this class to style SVG content using CSS.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/class](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/class)
   */
  class?: string
  /**
   * The `style` attribute allows to style an element using CSS declarations.
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/style](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/style)
   */
  style?: CSSProperties
}

export interface SVGConditionalProcessingAttributes {
  externalResourcesRequired?: boolean
  requiredExtensions?: string
  requiredFeatures?: string
  systemLanguage?: string
}

export interface SVGCommonAttributes<T>
  extends AriaAttributes,
    SVGCoreAttributes<T> {}

export interface SVGXLinkAttributes {
  xlinkHref?: string
  xlinkType?: 'simple'
  xlinkRole?: string
  xlinkArcrole?: string
  xlinkTitle?: string
  xlinkShow?: 'new' | 'replace' | 'embed' | 'other' | 'none'
  xlinkActuate?: string
}

export interface SVGPresentationClipAttributes {
  clip?: string
  /**
   * The `clip-path` presentation attribute defines or associates a clipping
   * path with the element it is related to.
   *
   * **Note**: As a presentation attribute clip-path can be used as a CSS
   * property.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/clip-path](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/clip-path)
   */
  clipPath?: string
  /**
   * The `clip-rule` attribute only applies to graphics elements that are
   * contained within a `<clipPath>` element. The `clip-rule` attribute
   * basically works as the `fill-rule` attribute, except that it applies to
   * `<clipPath>` definitions.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/clip-rule](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/clip-rule)
   */
  clipRule?: 'nonzero' | 'evenodd'
}

export interface SVGPresentationColorAttributes {
  /**
   * The `color` attribute is used to provide a potential indirect value,
   * `currentcolor`, for the `fill`, `stroke`, `stop-color`, `flood-color`,
   * and `lighting-color` attributes.
   *
   * **Note**: As a presentation attribute, `color` can be used as a CSS
   * property. See [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) for further information.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color)
   */
  color?: string
  /**
   * The `color-interpolation` attribute specifies the color space for gradient
   * interpolations, color animations, and alpha compositing.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color-interpolation](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color-interpolation)
   */
  colorInterpolation?: string
  /**
   * The `color-interpolation-filters` attribute specifies the color space for
   * imaging operations performed via filter effects.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color-interpolation-filters](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color-interpolation-filters)
   */
  colorInterpolationFilters?: string
  /**
   *
   * The `color-profile` attribute is used to define which color profile a
   * raster image included through the `<image>` element should use.
   *
   * **Note**: As a presentation attribute, color-profile can be used as a
   * CSS property.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color-profile](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color-profile)

  * @deprecated Since SVG 2
   *
   * This feature is no longer recommended. Though some browsers might still
   * support it, it may have already been removed from the relevant web
   * standards, may be in the process of being dropped, or may only be kept
   * for compatibility purposes. Avoid using it, and update existing code if
   * possible; see the compatibility table at the bottom of this page to guide
   * your decision. Be aware that this feature may cease to work at any time.
   */
  colorProfile?: string
  /**
   * The `color-rendering` attribute provides a hint to the SVG user agent
   * about how to optimize its color interpolation and compositing operations.
   *
   * @deprecated This feature is no longer recommended. Though some browsers
   * might still support it, it may have already been removed from the relevant
   * web standards, may be in the process of being dropped, or may only be
   * kept for compatibility purposes. Avoid using it, and update existing code
   * if possible; see the compatibility table at the bottom of this page to
   * guide your decision. Be aware that this feature may cease to work at any
   * time.
   */
  colorRendering?: string
  lightingColor?: string
  solidColor?: string
  solidOpacity?: number
  stopColor?: string
  stopOpacity?: number
}

export interface SVGPresentationFillAttributes {
  /**
   * The `fill` attribute has two different meanings. For shapes and text it's a
   * presentation attribute that defines the color (or any SVG paint servers
   * like gradients or patterns) used to paint the element; for animation it
   * defines the final state of the animation.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill)
   */
  fill?: string
  /**
   * The `fill-opacity` attribute is a presentation attribute defining the
   * opacity of the paint server (color, gradient, pattern, etc) applied to
   * a shape.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-opacity](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-opacity)
   */
  fillOpacity?: number
  /**
   * The `fill-rule` attribute is a presentation attribute defining the
   * algorithm to use to determine the inside part of a shape.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-rule](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-rule)
   */
  fillRule?: 'nonzero' | 'evenodd'
}

export interface SVGPresentationFloodAttributes {
  /**
   * The `flood-color` attribute indicates what color to use to flood the
   * current filter primitive subregion.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/flood-color](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/flood-color)
   */
  floodColor?: string
  /**
   * The `flood-opacity` attribute indicates the opacity value to use across
   * the current filter primitive subregion.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/flood-opacity](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/flood-opacity)
   */
  floodOpacity?: number
}

export interface SVGPresentationFontAttributes {
  /**
   * The `font-family` attribute indicates which font family will be used to
   * render the text, specified as a prioritized list of font family names
   * and/or generic family names.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-family](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-family)
   */
  fontFamily?: string
  /**
   * The `font-size` attribute refers to the size of the font from baseline to
   * baseline when multiple lines of text are set solid in a multiline layout
   * environment.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size)
   */
  fontSize?: number | string
  /**
   * The `font-size-adjust` attribute allows authors to specify an aspect value
   * for an element that will preserve the x-height of the first choice font in
   * a substitute font.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size-adjust](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size-adjust)
   */
  fontSizeAdjust?: number
  /**
   * The `font-stretch` attribute indicates the desired amount of condensing or
   * expansion in the glyphs used to render the text.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-stretch](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-stretch)
   */
  fontStretch?: string
  /**
   * The `font-style` attribute specifies whether the text is to be rendered
   * using a normal, italic, or oblique face.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-style](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-style)
   */
  fontStyle?: 'normal' | 'italic' | 'oblique'
  /**
   * The `font-variant` attribute indicates whether the text is to be rendered
   * using variations of the font's glyphs.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-variant](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-variant)
   */
  fontVariant?: string
  /**
   * The `font-weight` attribute refers to the boldness or lightness of the
   * glyphs used to render the text, relative to other fonts in the same font
   * family.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-weight](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-weight)
   */
  fontWeight?: number | 'normal' | 'bold' | 'bolder' | 'lighter'
  /**
   * The `letter-spacing` attribute controls spacing between text characters.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/letter-spacing](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/letter-spacing)
   */
  letterSpacing?: number
  /**
   * The `text-anchor` attribute is used to align (start-, middle- or
   * end-alignment) a string of pre-formatted text or auto-wrapped text where
   * the wrapping area is determined from the inline-size property relative to
   * a given point. It is not applicable to other types of auto-wrapped text.
   * For those cases you should use text-align. For multi-line text, the
   * alignment takes place for each line.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
   */
  textAnchor?: 'start' | 'middle' | 'end'
  /**
   * The `text-decoration` attribute defines whether text is decorated with an
   * underline, overline and/or strike-through. It is a shorthand for the
   * text-decoration-line and text-decoration-style properties.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-decoration](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-decoration)
   */
  textDecoration?: string
  /**
   * The `unicode-bidi` attribute specifies how the accumulation of the
   * background image is managed.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/unicode-bidi](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/unicode-bidi)
   */
  unicodeBidi?:
    | 'normal'
    | 'embed'
    | 'isolate'
    | 'bidi-override'
    | 'isolate-override'
    | 'plaintext'
  /**
   * The `word-spacing` attribute specifies spacing behavior between words.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/word-spacing](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/word-spacing)
   */
  wordSpacing?: number
  /**
   * The `writing-mode` attribute specifies whether the initial
   * inline-progression-direction for a `<text>` element shall be left-to-right,
   * right-to-left, or top-to-bottom.
   */
  writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr'
  /**
   * The `alignment-baseline` attribute specifies how an object is aligned with
   * respect to its parent. This property specifies which baseline of this
   * element is to be aligned with the corresponding baseline of the parent.
   *
   * For example, this allows alphabetic baselines in Roman text to stay aligned
   * across font size changes. It defaults to the baseline with the same name as
   * the computed value of the `alignment-baseline` property.
   */
  alignmentBaseline?:
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical'
    | 'top'
    | 'center'
    | 'bottom'
  /**
   * The `baseline-shift` attribute allows repositioning of the
   * dominant-baseline relative to the dominant-baseline of the parent text
   * content element. The shifted object might be a sub- or superscript.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/baseline-shift](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/baseline-shift)
   */
  baselineShift?: string | 'sub' | 'super'
  /**
   * The `dominant-baseline` attribute specifies the dominant baseline, which
   * is the baseline used to align the box’s text and inline-level contents.
   * It also indicates the default alignment baseline of any boxes participating
   * in baseline alignment in the box’s alignment context.
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dominant-baseline](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dominant-baseline)
   */
  dominantBaseline?: string
  direction?: 'ltr' | 'rtl'
  glyphOrientationHorizontal?: 'auto' | number
  glyphOrientationVertical?: 'auto' | number
}

export interface SVGPresentationMarkerAttributes {
  markerEnd?: string
  markerStart?: string
  markerMid?: string
}

export interface SVGPresentationStrokeAttributes {
  stroke?: string
  strokeDasharray?: string
  strokeDashoffset?: string
  strokeLinecap?: string
  strokeLinejoin?: string
  strokeMiterlimit?: string
  strokeOpacity?: string
  strokeWidth?: string
}

export interface SVGPresentationTransformAttributes {
  transform?: string
  transformOrigin?: string
}

export interface SVGPresentationAttributes
  extends SVGPresentationClipAttributes,
    SVGPresentationColorAttributes,
    SVGPresentationFillAttributes,
    SVGPresentationStrokeAttributes,
    SVGPresentationTransformAttributes,
    SVGPresentationFloodAttributes,
    SVGPresentationFontAttributes,
    SVGPresentationMarkerAttributes,
    SVGPresentationStrokeAttributes {
  cursor?: string
  display?: string
  filter?: string
  mask?: string
  opacity?: number
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  pointerEvents?:
    | 'bounding-box'
    | 'visiblePainted'
    | 'visibleFill'
    | 'visibleStroke'
    | 'visible'
    | 'painted'
    | 'fill'
    | 'stroke'
    | 'all'
    | 'none'
  shapeRendering?:
    | 'auto'
    | 'optimizeSpeed'
    | 'crispEdges'
    | 'geometricPrecision'
  imageRendering?: 'auto' | 'optimizeSpeed' | 'optimizeQuality'
  enableBackground?: string | number
  kerning?: 'auto' | number
  vectorEffect?: string
  visibility?: string
}

export interface SVGFilterPrimitiveAttributes {
  height?: number | string
  result?: string
  width?: number | string
  x?: number
  y?: number
}

export interface SVGTransferFunctionAttributes {
  type?: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY'
  tableValues?: string
  slope?: number
  intercept?: number
  amplitude?: number
  exponent?: number
  offset?: number
}
