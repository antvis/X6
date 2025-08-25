import { expect } from 'vitest'
import { toMatchDOMSnapshot } from './toMatchDOMSnapshot'

declare module 'vitest' {
  interface Assertion {
    toMatchDOMSnapshot(dir: string, name: string, options?: object): void
  }
}

expect.extend({
  toMatchDOMSnapshot,
})
