import { version } from '../src'

describe('version', () => {
  it('should match the `version` field of package.json', () => {
    expect(version).toBe('1.0.0')
  })
})
