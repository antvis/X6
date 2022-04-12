import { version } from '../src'

describe('version', () => {
  it('should match the `version` field of package.json', () => {
    // eslint-disable-next-line
    const expected = require('../package.json').version
    expect(version).toBe(expected)
  })
})
