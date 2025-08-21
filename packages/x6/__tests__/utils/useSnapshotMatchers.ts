import { expect } from 'vitest'
import { toMatchDOMSnapshot } from './toMatchDOMSnapshot'

declare module 'vitest' {
  interface Assertion {
    toMatchDOMSnapshot(dir: string, name: string): void
  }
}

expect.extend({
  toMatchDOMSnapshot,
})
