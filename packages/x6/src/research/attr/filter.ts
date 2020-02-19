export namespace Filter {
  export interface OutlineArgs {
    /**
     * Outline color. Default `'blue'`.
     */
    color?: string
    /**
     * Outline width. Default `1`
     */
    width?: number
    /**
     * Gap between outline and the element. Default `2`
     */
    margin?: number
    /**
     * Outline opacity. Default `1`
     */
    opacity?: number
  }

  export function outline(args: OutlineArgs = {}) {
    const color = getString(args.color, 'blue')
    const width = getNumber(args.width, 1)
    const margin = getNumber(args.margin, 2)
    const opacity = getNumber(args.opacity, 1)

    const innerRadius = margin
    const outerRadius = margin + width

    return `
      <filter>
        <feFlood flood-color="${color}" flood-opacity="${opacity}" result="colored"/>
        <feMorphology in="SourceAlpha" result="morphedOuter" operator="dilate" radius="${outerRadius}" />
        <feMorphology in="SourceAlpha" result="morphedInner" operator="dilate" radius="${innerRadius}" />
        <feComposite result="morphedOuterColored" in="colored" in2="morphedOuter" operator="in"/>
        <feComposite operator="xor" in="morphedOuterColored" in2="morphedInner" result="outline"/>
        <feMerge>
          <feMergeNode in="outline"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `.trim()
  }

  export interface HighlightArgs {
    /**
     * Highlight color. Default `'red'`.
     */
    color?: string
    /**
     * Highlight blur. Default `0`.
     */
    blur?: number
    /**
     * Highlight width. Default `1`.
     */
    width?: number
    /**
     * Highlight opacity. Default `1`.
     */
    opacity?: number
  }

  export function highlight(args: HighlightArgs = {}) {
    const color = getString(args.color, 'red')
    const blur = getNumber(args.blur, 0)
    const width = getNumber(args.width, 1)
    const opacity = getNumber(args.opacity, 1)

    return `
      <filter>
        <feFlood flood-color="${color}" flood-opacity="${opacity}" result="colored"/>
        <feMorphology result="morphed" in="SourceGraphic" operator="dilate" radius="${width}"/>
        <feComposite result="composed" in="colored" in2="morphed" operator="in"/>
        <feGaussianBlur result="blured" in="composed" stdDeviation="${blur}"/>
        <feBlend in="SourceGraphic" in2="blured" mode="normal"/>
      </filter>
    `.trim
  }

  export interface BlurArgs {
    /**
     * Horizontal blur. Default `2`
     */
    x?: number
    /**
     * Vertical blur.
     */
    y?: number
  }

  export function blur(args: BlurArgs = {}) {
    const x = getNumber(args.x, 2)
    const stdDeviation = args.y != null && isFinite(args.y) ? [x, args.y] : x

    return `
      <filter>
        <feGaussianBlur stdDeviation="${stdDeviation}"/>
      </filter>
    `.trim()
  }

  export interface DropShadowArgs {
    dx?: number
    dy?: number
    color?: string
    blur?: number
    opacity?: number
  }

  export function dropShadow(args: DropShadowArgs = {}) {
    const dx = getNumber(args.dx, 0)
    const dy = getNumber(args.dy, 0)
    const color = getString(args.color, 'black')
    const blur = getNumber(args.blur, 4)
    const opacity = getNumber(args.opacity, 1)

    return 'SVGFEDropShadowElement' in window
      ? `<filter>
           <feDropShadow stdDeviation="${blur}" dx="${dx}" dy="${dy}" flood-color="${color}" flood-opacity="${opacity}" />
         </filter>`.trim()
      : `<filter>
           <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" />
           <feOffset dx="${dx}" dy="${dy}" result="offsetblur" />
           <feFlood flood-color="${color}" />
           <feComposite in2="offsetblur" operator="in" />
           <feComponentTransfer>
             <feFuncA type="linear" slope="${opacity}" />
           </feComponentTransfer>
           <feMerge>
             <feMergeNode/>
             <feMergeNode in="SourceGraphic"/>
           </feMerge>
         </filter>`.trim()
  }

  export interface GrayScaleArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` is completely grayscale.
     * A value of `0` leaves the input unchanged.
     *
     * Default `1`.
     */
    amount?: number
  }

  export function grayScale(args: GrayScaleArgs = {}) {
    const amount = getNumber(args.amount, 1)
    const a = 0.2126 + 0.7874 * (1 - amount)
    const b = 0.7152 - 0.7152 * (1 - amount)
    const c = 0.0722 - 0.0722 * (1 - amount)
    const d = 0.2126 - 0.2126 * (1 - amount)
    const e = 0.7152 + 0.2848 * (1 - amount)
    const f = 0.0722 - 0.0722 * (1 - amount)
    const g = 0.2126 - 0.2126 * (1 - amount)
    const h = 0.0722 + 0.9278 * (1 - amount)

    return `
      <filter>
        <feColorMatrix type="matrix" values="${a} ${b} ${c} 0 0 ${d} ${e} ${f} 0 0 ${g} ${b} ${h} 0 0 0 0 0 1 0"/>
      </filter>
    `.trim()
  }

  export interface SepiaArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` is completely sepia.
     * A value of `0` leaves the input unchanged.
     *
     * Default `1`.
     */
    amount?: number
  }
  export function sepia(args: SepiaArgs = {}) {
    const amount = getNumber(args.amount, 1)
    const a = 0.393 + 0.607 * (1 - amount)
    const b = 0.769 - 0.769 * (1 - amount)
    const c = 0.189 - 0.189 * (1 - amount)
    const d = 0.349 - 0.349 * (1 - amount)
    const e = 0.686 + 0.314 * (1 - amount)
    const f = 0.168 - 0.168 * (1 - amount)
    const g = 0.272 - 0.272 * (1 - amount)
    const h = 0.534 - 0.534 * (1 - amount)
    const i = 0.131 + 0.869 * (1 - amount)

    return `
      <filter>
        <feColorMatrix type="matrix" values="${a} ${b} ${c} 0 0 ${d} ${e} ${f} 0 0 ${g} ${h} ${i} 0 0 0 0 0 1 0"/>
      </filter>
    `.trim()
  }

  export interface SaturateArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` is completely un-saturated.
     * A value of `0` leaves the input unchanged.
     *
     * Default `1`.
     */
    amount?: number
  }

  export function saturate(args: SaturateArgs = {}) {
    const amount = getNumber(args.amount, 1)
    return `
      <filter>
        <feColorMatrix type="saturate" values="${1 - amount}"/>
      </filter>
    `.trim
  }

  export interface HueRotateArgs {
    /**
     * The number of degrees around the color.
     *
     * Default `0`.
     */
    angle?: number
  }

  export function hueRotate(args: HueRotateArgs = {}) {
    const angle = getNumber(args.angle, 0)
    return `
      <filter>
        <feColorMatrix type="hueRotate" values="${angle}"/>
      </filter>
    `.trim()
  }

  export interface InvertArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` is completely inverted.
     * A value of `0` leaves the input unchanged.
     *
     * Default `1`.
     */
    amount?: number
  }

  export function invert(args: InvertArgs = {}) {
    const amount = getNumber(args.amount, 1)
    const amount2 = 1 - amount
    return `
      <filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="${amount} ${amount2}"/>
          <feFuncG type="table" tableValues="${amount} ${amount2}"/>
          <feFuncB type="table" tableValues="${amount} ${amount2}"/>
        </feComponentTransfer>
      </filter>
    `.trim()
  }

  export interface BrightnessArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` leaves the input unchanged.
     * A value of `0` will create an image that is completely black.
     *
     * Default `1`.
     */
    amount?: number
  }

  export function brightness(args: BrightnessArgs = {}) {
    const amount = getNumber(args.amount, 1)
    return `
      <filter>
        <feComponentTransfer>
          <feFuncR type="linear" slope="${amount}"/>
          <feFuncG type="linear" slope="${amount}"/>
          <feFuncB type="linear" slope="${amount}"/>
        </feComponentTransfer>
      </filter>
    `.trim()
  }

  export interface ContrastArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` leaves the input unchanged.
     * A value of `0` will create an image that is completely black.
     *
     * Default `1`.
     */
    amount?: number
  }

  export function contrast(args: ContrastArgs = {}) {
    const amount = getNumber(args.amount, 1)
    const amount2 = 0.5 - amount / 2

    return `
      <filter>
       <feComponentTransfer>
          <feFuncR type="linear" slope="${amount}" intercept="${amount2}"/>
          <feFuncG type="linear" slope="${amount}" intercept="${amount2}"/>
          <feFuncB type="linear" slope="${amount}" intercept="${amount2}"/>
        </feComponentTransfer>
      </filter>
    `.trim()
  }
}

function getString(value: string | null | undefined, defaultValue: string) {
  return value != null ? value : defaultValue
}

function getNumber(num: number | null | undefined, defaultValue: number) {
  return num != null && isFinite(num) ? num : defaultValue
}
