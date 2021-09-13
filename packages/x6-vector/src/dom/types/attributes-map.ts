import {
  Booleanish,
  CSSProperties,
  AriaAttributes,
  CustomAttributes,
  HTMLAttributeReferrerPolicy,
} from './attributes-core'

interface HTMLAttributes<T> extends AriaAttributes, CustomAttributes<T> {
  // Standard HTML Attributes
  accessKey?: string
  class?: string
  contentEditable?: Booleanish | 'inherit'
  contextMenu?: string
  dir?: string
  draggable?: Booleanish
  hidden?: boolean
  id?: string
  lang?: string
  placeholder?: string
  slot?: string
  spellCheck?: Booleanish
  style?: CSSProperties
  tabIndex?: number
  title?: string
  translate?: 'yes' | 'no'

  // Unknown
  radioGroup?: string // <command>, <menuitem>

  // WAI-ARIA
  role?: string

  // RDFa Attributes
  about?: string
  datatype?: string
  inlist?: any
  prefix?: string
  property?: string
  resource?: string
  typeof?: string
  vocab?: string

  // Non-standard Attributes
  autoCapitalize?: string
  autoCorrect?: string
  autoSave?: string
  color?: string
  itemProp?: string
  itemScope?: boolean
  itemType?: string
  itemID?: string
  itemRef?: string
  results?: number
  security?: string
  unselectable?: 'on' | 'off'

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
   */
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
   */
  is?: string
}

interface HTMLAnchorAttributes<T> extends HTMLAttributes<T> {
  download?: any
  href?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: HTMLAttributeReferrerPolicy
}

interface HTMLAudioAttributes<T> extends MediaHTMLAttributes<T> {}

interface HTMLAreaAttributes<T> extends HTMLAttributes<T> {
  alt?: string
  coords?: string
  download?: any
  href?: string
  hrefLang?: string
  media?: string
  referrerPolicy?: HTMLAttributeReferrerPolicy
  rel?: string
  shape?: string
  target?: string
}

interface HTMLBaseAttributes<T> extends HTMLAttributes<T> {
  href?: string
  target?: string
}

interface HTMLBlockquoteAttributes<T> extends HTMLAttributes<T> {
  cite?: string
}

interface HTMLButtonAttributes<T> extends HTMLAttributes<T> {
  autoFocus?: boolean
  disabled?: boolean
  form?: string
  formAction?: string
  formEncType?: string
  formMethod?: string
  formNoValidate?: boolean
  formTarget?: string
  name?: string
  type?: 'submit' | 'reset' | 'button'
  value?: string | ReadonlyArray<string> | number
}

interface HTMLCanvasAttributes<T> extends HTMLAttributes<T> {
  height?: number | string
  width?: number | string
}

interface HTMLColAttributes<T> extends HTMLAttributes<T> {
  span?: number
  width?: number | string
}

interface HTMLColgroupAttributes<T> extends HTMLAttributes<T> {
  span?: number
}

interface HTMLDataAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number
}

interface HTMLDetailsAttributes<T> extends HTMLAttributes<T> {
  open?: boolean
}

interface HTMLDelAttributes<T> extends HTMLAttributes<T> {
  cite?: string
  dateTime?: string
}

interface HTMLDialogAttributes<T> extends HTMLAttributes<T> {
  open?: boolean
}

interface HTMLEmbedAttributes<T> extends HTMLAttributes<T> {
  height?: number | string
  src?: string
  type?: string
  width?: number | string
}

interface HTMLFieldsetAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean
  form?: string
  name?: string
}

interface HTMLFormAttributes<T> extends HTMLAttributes<T> {
  acceptCharset?: string
  action?: string
  autoComplete?: string
  encType?: string
  method?: string
  name?: string
  noValidate?: boolean
  target?: string
}

interface HTMLHtmlAttributes<T> extends HTMLAttributes<T> {
  manifest?: string
}

interface HTMLIframeAttributes<T> extends HTMLAttributes<T> {
  allow?: string
  allowFullScreen?: boolean
  allowTransparency?: boolean
  /** @deprecated */
  frameBorder?: number | string
  height?: number | string
  loading?: 'eager' | 'lazy'
  /** @deprecated */
  marginHeight?: number
  /** @deprecated */
  marginWidth?: number
  name?: string
  referrerPolicy?: HTMLAttributeReferrerPolicy
  sandbox?: string
  /** @deprecated */
  scrolling?: string
  seamless?: boolean
  src?: string
  srcDoc?: string
  width?: number | string
}

interface HTMLImgAttributes<T> extends HTMLAttributes<T> {
  alt?: string
  crossOrigin?: 'anonymous' | 'use-credentials' | ''
  decoding?: 'async' | 'auto' | 'sync'
  height?: number | string
  loading?: 'eager' | 'lazy'
  referrerPolicy?: HTMLAttributeReferrerPolicy
  sizes?: string
  src?: string
  srcSet?: string
  useMap?: string
  width?: number | string
}

interface HTMLInsAttributes<T> extends HTMLAttributes<T> {
  cite?: string
  dateTime?: string
}

interface HTMLInputAttributes<T> extends HTMLAttributes<T> {
  accept?: string
  alt?: string
  autoComplete?: string
  autoFocus?: boolean
  capture?: boolean | string // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
  checked?: boolean
  crossOrigin?: string
  disabled?: boolean
  enterKeyHint?:
    | 'enter'
    | 'done'
    | 'go'
    | 'next'
    | 'previous'
    | 'search'
    | 'send'
  form?: string
  formAction?: string
  formEncType?: string
  formMethod?: string
  formNoValidate?: boolean
  formTarget?: string
  height?: number | string
  list?: string
  max?: number | string
  maxLength?: number
  min?: number | string
  minLength?: number
  multiple?: boolean
  name?: string
  pattern?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  size?: number
  src?: string
  step?: number | string
  type?: string
  value?: string | ReadonlyArray<string> | number
  width?: number | string
}

interface HTMLKeygenAttributes<T> extends HTMLAttributes<T> {
  autoFocus?: boolean
  challenge?: string
  disabled?: boolean
  form?: string
  keyType?: string
  keyParams?: string
  name?: string
}

interface HTMLLabelAttributes<T> extends HTMLAttributes<T> {
  form?: string
  for?: string
}

interface HTMLLiAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number
}

interface HTMLLinkAttributes<T> extends HTMLAttributes<T> {
  as?: string
  crossOrigin?: string
  href?: string
  hrefLang?: string
  integrity?: string
  media?: string
  referrerPolicy?: HTMLAttributeReferrerPolicy
  rel?: string
  sizes?: string
  type?: string
  charSet?: string
}

interface HTMLMapAttributes<T> extends HTMLAttributes<T> {
  name?: string
}

interface HTMLMenuAttributes<T> extends HTMLAttributes<T> {
  type?: string
}

interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
  autoPlay?: boolean
  controls?: boolean
  controlsList?: string
  crossOrigin?: string
  loop?: boolean
  mediaGroup?: string
  muted?: boolean
  playsInline?: boolean
  preload?: string
  src?: string
}

interface HTMLMetaAttributes<T> extends HTMLAttributes<T> {
  charSet?: string
  content?: string
  httpEquiv?: string
  name?: string
}

interface HTMLMeterAttributes<T> extends HTMLAttributes<T> {
  form?: string
  high?: number
  low?: number
  max?: number | string
  min?: number | string
  optimum?: number
  value?: string | ReadonlyArray<string> | number
}

interface HTMLQuoteAttributes<T> extends HTMLAttributes<T> {
  cite?: string
}

interface HTMLObjectAttributes<T> extends HTMLAttributes<T> {
  classID?: string
  data?: string
  form?: string
  height?: number | string
  name?: string
  type?: string
  useMap?: string
  width?: number | string
  wmode?: string
}

interface HTMLOlAttributes<T> extends HTMLAttributes<T> {
  reversed?: boolean
  start?: number
  type?: '1' | 'a' | 'A' | 'i' | 'I'
}

interface HTMLOptgroupAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean
  label?: string
}

interface HTMLOptionAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean
  label?: string
  selected?: boolean
  value?: string | ReadonlyArray<string> | number
}

interface HTMLOutputAttributes<T> extends HTMLAttributes<T> {
  form?: string
  for?: string
  name?: string
}

interface HTMLParamAttributes<T> extends HTMLAttributes<T> {
  name?: string
  value?: string | ReadonlyArray<string> | number
}

interface HTMLProgressAttributes<T> extends HTMLAttributes<T> {
  max?: number | string
  value?: string | ReadonlyArray<string> | number
}

interface HTMLSlotAttributes<T> extends HTMLAttributes<T> {
  name?: string
}

interface HTMLScriptAttributes<T> extends HTMLAttributes<T> {
  async?: boolean
  /** @deprecated */
  charSet?: string
  crossOrigin?: string
  defer?: boolean
  integrity?: string
  noModule?: boolean
  nonce?: string
  referrerPolicy?: HTMLAttributeReferrerPolicy
  src?: string
  type?: string
}

interface HTMLSelectAttributes<T> extends HTMLAttributes<T> {
  autoComplete?: string
  autoFocus?: boolean
  disabled?: boolean
  form?: string
  multiple?: boolean
  name?: string
  required?: boolean
  size?: number
  value?: string | ReadonlyArray<string> | number
}

interface HTMLSourceAttributes<T> extends HTMLAttributes<T> {
  media?: string
  sizes?: string
  src?: string
  srcSet?: string
  type?: string
}

interface HTMLStyleAttributes<T> extends HTMLAttributes<T> {
  media?: string
  nonce?: string
  scoped?: boolean
  type?: string
}

interface HTMLTableAttributes<T> extends HTMLAttributes<T> {
  cellPadding?: number | string
  cellSpacing?: number | string
  summary?: string
  width?: number | string
}

interface HTMLTextareaAttributes<T> extends HTMLAttributes<T> {
  autoComplete?: string
  autoFocus?: boolean
  cols?: number
  dirName?: string
  disabled?: boolean
  form?: string
  maxLength?: number
  minLength?: number
  name?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  rows?: number
  value?: string | ReadonlyArray<string> | number
  wrap?: string
}

interface HTMLTdAttributes<T> extends HTMLAttributes<T> {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char'
  colSpan?: number
  headers?: string
  rowSpan?: number
  scope?: string
  abbr?: string
  height?: number | string
  width?: number | string
  valign?: 'top' | 'middle' | 'bottom' | 'baseline'
}

interface HTMLThAttributes<T> extends HTMLAttributes<T> {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char'
  colSpan?: number
  headers?: string
  rowSpan?: number
  scope?: string
  abbr?: string
}

interface HTMLTimeAttributes<T> extends HTMLAttributes<T> {
  dateTime?: string
}

interface HTMLTrackAttributes<T> extends HTMLAttributes<T> {
  default?: boolean
  kind?: string
  label?: string
  src?: string
  srcLang?: string
}

interface HTMLVideoAttributes<T> extends MediaHTMLAttributes<T> {
  height?: number | string
  playsInline?: boolean
  poster?: string
  width?: number | string
  disablePictureInPicture?: boolean
  disableRemotePlayback?: boolean
}

interface HTMLWebViewAttributes<T> extends HTMLAttributes<T> {
  allowFullScreen?: boolean
  allowpopups?: boolean
  autoFocus?: boolean
  autosize?: boolean
  blinkfeatures?: string
  disableblinkfeatures?: string
  disableguestresize?: boolean
  disablewebsecurity?: boolean
  guestinstance?: string
  httpreferrer?: string
  nodeintegration?: boolean
  partition?: string
  plugins?: boolean
  preload?: string
  src?: string
  useragent?: string
  webpreferences?: string
}

export interface HTMLAttributesTagNameMap {
  a: HTMLAnchorAttributes<HTMLAnchorElement>
  abbr: HTMLAttributes<HTMLElement>
  address: HTMLAttributes<HTMLElement>
  applet: HTMLAttributes<HTMLElement>
  area: HTMLAreaAttributes<HTMLAreaElement>
  article: HTMLAttributes<HTMLElement>
  aside: HTMLAttributes<HTMLElement>
  audio: HTMLAudioAttributes<HTMLAudioElement>
  b: HTMLAttributes<HTMLElement>
  base: HTMLBaseAttributes<HTMLBaseElement>
  basefont: HTMLAttributes<HTMLElement>
  bdi: HTMLAttributes<HTMLElement>
  bdo: HTMLAttributes<HTMLElement>
  big: HTMLAttributes<HTMLElement>
  blockquote: HTMLBlockquoteAttributes<HTMLElement>
  body: HTMLAttributes<HTMLBodyElement>
  br: HTMLAttributes<HTMLBRElement>
  button: HTMLButtonAttributes<HTMLButtonElement>
  canvas: HTMLCanvasAttributes<HTMLCanvasElement>
  caption: HTMLAttributes<HTMLElement>
  cite: HTMLAttributes<HTMLElement>
  code: HTMLAttributes<HTMLElement>
  col: HTMLColAttributes<HTMLTableColElement>
  colgroup: HTMLColgroupAttributes<HTMLTableColElement>
  data: HTMLDataAttributes<HTMLDataElement>
  datalist: HTMLAttributes<HTMLDataListElement>
  dd: HTMLAttributes<HTMLElement>
  del: HTMLDelAttributes<HTMLElement>
  details: HTMLDetailsAttributes<HTMLElement>
  dfn: HTMLAttributes<HTMLElement>
  dialog: HTMLDialogAttributes<HTMLDialogElement>
  dir: HTMLAttributes<HTMLDirectoryElement>
  DIV: HTMLAttributes<HTMLDivElement>
  div: HTMLAttributes<HTMLDivElement>
  dl: HTMLAttributes<HTMLDListElement>
  dt: HTMLAttributes<HTMLElement>
  em: HTMLAttributes<HTMLElement>
  embed: HTMLEmbedAttributes<HTMLEmbedElement>
  fieldset: HTMLFieldsetAttributes<HTMLFieldSetElement>
  figcaption: HTMLAttributes<HTMLElement>
  figure: HTMLAttributes<HTMLElement>
  font: HTMLAttributes<HTMLFontElement>
  footer: HTMLAttributes<HTMLElement>
  form: HTMLFormAttributes<HTMLFormElement>
  frame: HTMLAttributes<HTMLFrameElement>
  frameset: HTMLAttributes<HTMLFrameSetElement>
  h1: HTMLAttributes<HTMLHeadingElement>
  h2: HTMLAttributes<HTMLHeadingElement>
  h3: HTMLAttributes<HTMLHeadingElement>
  h4: HTMLAttributes<HTMLHeadingElement>
  h5: HTMLAttributes<HTMLHeadingElement>
  h6: HTMLAttributes<HTMLHeadingElement>
  head: HTMLAttributes<HTMLHeadElement>
  header: HTMLAttributes<HTMLElement>
  hgroup: HTMLAttributes<HTMLElement>
  hr: HTMLAttributes<HTMLHRElement>
  html: HTMLHtmlAttributes<HTMLHtmlElement>
  i: HTMLAttributes<HTMLElement>
  iframe: HTMLIframeAttributes<HTMLIFrameElement>
  img: HTMLImgAttributes<HTMLImageElement>
  input: HTMLInputAttributes<HTMLInputElement>
  ins: HTMLInsAttributes<HTMLModElement>
  kbd: HTMLAttributes<HTMLElement>
  keygen: HTMLKeygenAttributes<HTMLElement>
  label: HTMLLabelAttributes<HTMLLabelElement>
  legend: HTMLAttributes<HTMLLegendElement>
  li: HTMLLiAttributes<HTMLLIElement>
  link: HTMLLinkAttributes<HTMLLinkElement>
  main: HTMLAttributes<HTMLElement>
  map: HTMLMapAttributes<HTMLMapElement>
  mark: HTMLAttributes<HTMLElement>
  menu: HTMLMenuAttributes<HTMLElement>
  menuitem: HTMLAttributes<HTMLElement>
  meta: HTMLMetaAttributes<HTMLMetaElement>
  meter: HTMLMeterAttributes<HTMLElement>
  nav: HTMLAttributes<HTMLElement>
  noindex: HTMLAttributes<HTMLElement>
  noscript: HTMLAttributes<HTMLElement>
  object: HTMLObjectAttributes<HTMLObjectElement>
  ol: HTMLOlAttributes<HTMLOListElement>
  optgroup: HTMLOptgroupAttributes<HTMLOptGroupElement>
  option: HTMLOptionAttributes<HTMLOptionElement>
  output: HTMLOutputAttributes<HTMLElement>
  p: HTMLAttributes<HTMLParagraphElement>
  param: HTMLParamAttributes<HTMLParamElement>
  picture: HTMLAttributes<HTMLElement>
  pre: HTMLAttributes<HTMLPreElement>
  progress: HTMLProgressAttributes<HTMLProgressElement>
  q: HTMLQuoteAttributes<HTMLQuoteElement>
  rp: HTMLAttributes<HTMLElement>
  rt: HTMLAttributes<HTMLElement>
  ruby: HTMLAttributes<HTMLElement>
  s: HTMLAttributes<HTMLElement>
  samp: HTMLAttributes<HTMLElement>
  script: HTMLScriptAttributes<HTMLScriptElement>
  section: HTMLAttributes<HTMLElement>
  select: HTMLSelectAttributes<HTMLSelectElement>
  slot: HTMLSlotAttributes<HTMLSlotElement>
  small: HTMLAttributes<HTMLElement>
  source: HTMLSourceAttributes<HTMLSourceElement>
  span: HTMLAttributes<HTMLSpanElement>
  strong: HTMLAttributes<HTMLElement>
  style: HTMLStyleAttributes<HTMLStyleElement>
  sub: HTMLAttributes<HTMLElement>
  summary: HTMLAttributes<HTMLElement>
  sup: HTMLAttributes<HTMLElement>
  table: HTMLTableAttributes<HTMLTableElement>
  tbody: HTMLAttributes<HTMLTableSectionElement>
  td: HTMLTdAttributes<HTMLTableDataCellElement>
  template: HTMLAttributes<HTMLTemplateElement>
  textarea: HTMLTextareaAttributes<HTMLTextAreaElement>
  tfoot: HTMLAttributes<HTMLTableSectionElement>
  th: HTMLThAttributes<HTMLTableHeaderCellElement>
  thead: HTMLAttributes<HTMLTableSectionElement>
  time: HTMLTimeAttributes<HTMLElement>
  title: HTMLAttributes<HTMLTitleElement>
  tr: HTMLAttributes<HTMLTableRowElement>
  track: HTMLTrackAttributes<HTMLTrackElement>
  u: HTMLAttributes<HTMLElement>
  ul: HTMLAttributes<HTMLUListElement>
  var: HTMLAttributes<HTMLElement>
  video: HTMLVideoAttributes<HTMLVideoElement>
  wbr: HTMLAttributes<HTMLElement>
  webview: HTMLWebViewAttributes<HTMLWebViewElement>
}

export type HTMLAttributesMap<T extends HTMLElement> = {
  [K in keyof HTMLElementTagNameMap]-?: T extends HTMLElementTagNameMap[K]
    ? K extends keyof HTMLAttributesTagNameMap
      ? HTMLAttributesTagNameMap[K]
      : never
    : never
}[keyof HTMLElementTagNameMap]
