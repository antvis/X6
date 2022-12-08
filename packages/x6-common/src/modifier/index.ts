import { Dom } from '../dom'

export type ModifierKey =
  | 'ctrl'
  | 'alt'
  | 'shift'
  | 'meta'
  | 'tab'
  | 'space'
  | 'caps'
  | '~'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'

// eslint-disable-next-line
export class Modifier {
  private modifier: string | null

  startListenModifier() {
    Dom.Event.on(document.body, {
      'keydown.modifierKey': this.onKeydown.bind(this),
      'keypress.modifierKey': this.onKeydown.bind(this),
      'keyup.modifierKey': this.onKeyup.bind(this),
    })
    Dom.Event.on(window as any, {
      'keydown.modifierKey': this.onKeydown.bind(this),
      'keypress.modifierKey': this.onKeydown.bind(this),
      'keyup.modifierKey': this.onKeyup.bind(this),
    })
  }

  stopListenModifier() {
    Dom.Event.off(document.body, '.modifierKey')
    Dom.Event.off(window as any, '.modifierKey')
  }

  protected onKeydown(evt: KeyboardEvent) {
    this.modifier = this.formatKey(evt.key)
  }

  protected onKeyup() {
    this.modifier = null
  }

  protected formatKey(key: string) {
    return key
      .replace(/\s/g, 'space')
      .replace('Control', 'ctrl')
      .replace('CapsLock', 'caps')
      .toLowerCase()
  }

  parse(modifiers: string | ModifierKey[]) {
    const or: ModifierKey[] = []
    const and: ModifierKey[] = []

    if (Array.isArray(modifiers)) {
      or.push(...modifiers)
    } else {
      modifiers.split('|').forEach((item) => {
        if (item.indexOf('&') === -1) {
          or.push(item as ModifierKey)
        } else {
          and.push(...(item.split('&') as ModifierKey[]))
        }
      })
    }

    return { or, and }
  }

  equals(
    modifiers1?: string | ModifierKey[] | null,
    modifiers2?: string | ModifierKey[] | null,
  ) {
    if (modifiers1 != null && modifiers2 != null) {
      const m1 = this.parse(modifiers1)
      const m2 = this.parse(modifiers2)
      const or1 = m1.or.sort()
      const or2 = m2.or.sort()
      const and1 = m1.and.sort()
      const and2 = m2.and.sort()

      const equal = (a1: ModifierKey[], a2: ModifierKey[]) => {
        return (
          a1.length === a2.length &&
          (a1.length === 0 || a1.every((a, i) => a === a2[i]))
        )
      }

      return equal(or1, or2) && equal(and1, and2)
    }

    if (modifiers1 == null && modifiers2 == null) {
      return true
    }

    return false
  }

  isMatch(modifiers?: string | ModifierKey[] | null, strict?: boolean) {
    if (
      modifiers == null ||
      (Array.isArray(modifiers) && modifiers.length === 0)
    ) {
      return strict ? this.modifier === null : true
    }

    const { or, and } = this.parse(modifiers)
    const match = (key: string) => this.modifier === key

    return or.some((key) => match(key)) && and.every((key) => match(key))
  }
}
