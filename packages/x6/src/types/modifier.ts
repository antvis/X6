export type ModifierKey = 'alt' | 'ctrl' | 'meta' | 'shift'

// eslint-disable-next-line
export namespace ModifierKey {
  export function parse(modifiers: string | ModifierKey[]) {
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

  export function equals(
    modifiers1?: string | ModifierKey[] | null,
    modifiers2?: string | ModifierKey[] | null,
  ) {
    if (modifiers1 != null && modifiers2 != null) {
      const m1 = parse(modifiers1)
      const m2 = parse(modifiers2)
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

  export function isMatch(
    e: JQuery.TriggeredEvent | WheelEvent,
    modifiers?: string | ModifierKey[] | null,
    strict?: boolean,
  ) {
    if (
      modifiers == null ||
      (Array.isArray(modifiers) && modifiers.length === 0)
    ) {
      return strict
        ? e.altKey !== true &&
            e.ctrlKey !== true &&
            e.metaKey !== true &&
            e.shiftKey !== true
        : true
    }

    const { or, and } = parse(modifiers)
    const match = (key: ModifierKey) => {
      const name = `${key.toLowerCase()}Key` as 'altKey'
      return e[name] === true
    }

    return or.some((key) => match(key)) && and.every((key) => match(key))
  }
}
