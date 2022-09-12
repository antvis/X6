const propMap: Record<string, string> = {
  /* GENERAL */
  class: 'className',
  contenteditable: 'contentEditable',
  /* LABEL */
  for: 'htmlFor',
  /* INPUT */
  readonly: 'readOnly',
  maxlength: 'maxLength',
  tabindex: 'tabIndex',
  /* TABLE */
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  /* IMAGE */
  usemap: 'useMap',
}

export function prop(elem: Element, props: string): any
export function prop(elem: Element, props: string, value: any): void
export function prop(elem: Element, props: Record<string, any>): void
export function prop(
  elem: Element,
  props: string | Record<string, any>,
  value?: any,
) {
  if (!props) {
    return
  }

  if (typeof props === 'string') {
    props = propMap[props] || props // eslint-disable-line

    if (arguments.length < 3) {
      return (elem as any)[props]
    }

    ;(elem as any)[props] = value
    return
  }

  // eslint-disable-next-line
  for (const key in props) {
    prop(elem, key, props[key])
  }
}
