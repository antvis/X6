export function isNotReservedWord(member: string) {
  return (
    member !== 'offset' &&
    member !== 'easing' &&
    member !== 'composite' &&
    member !== 'computedOffset'
  )
}

export function isReverseDirection(
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse',
  currentIteration: number,
): boolean {
  return (
    direction === 'reverse' ||
    (direction === 'alternate' && currentIteration % 2 === 1) ||
    (direction === 'alternate-reverse' && currentIteration % 2 === 0)
  )
}
