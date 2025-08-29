import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ObjectExt, StringExt } from '../../../src/common'
import type { ToolItemOptions } from '../../../src/view/tool/tool-item'
import { define, getClassName } from '../../../src/view/tool/util'

vi.mock('../../../src/common', () => ({
  ObjectExt: {
    createClass: vi.fn(),
  },
  StringExt: {
    pascalCase: vi.fn(),
  },
}))

describe('util', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getClassName', () => {
    it('should return pascal case name when name is provided', () => {
      const mockPascalCase = vi.mocked(StringExt.pascalCase)
      mockPascalCase.mockReturnValue('TestTool')

      const result = getClassName('test-tool')

      expect(mockPascalCase).toHaveBeenCalledWith('test-tool')
      expect(result).toBe('TestTool')
    })

    it('should return incremented CustomTool name when no name provided', () => {
      const result1 = getClassName()
      const result2 = getClassName()

      expect(result1).toMatch(/^CustomTool\d+$/)
      expect(result2).toMatch(/^CustomTool\d+$/)
      expect(result1).not.toBe(result2)
    })
  })
})
