import { version } from './version'

describe('version', () => {
  it('should match the `version` field of package.json', () => {
    const expected = require('../package.json').version
    expect(version).toBe(expected)
  })
})
