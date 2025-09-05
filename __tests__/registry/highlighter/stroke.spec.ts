import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom, Util, Vector } from '../../../src/common'
import { stroke } from '../../../src/registry/highlighter/stroke'

vi.mock('../../../src/common', () => {
  const mockSvgElement = {
    setAttribute: vi.fn(),
    appendChild: vi.fn(),
  }

  return {
    Dom: {
      createSvgElement: vi.fn().mockReturnValue(mockSvgElement),
      attr: vi.fn(),
      kebablizeAttrs: vi.fn(),
      transform: vi.fn(),
      addClass: vi.fn(),
      ensureId: vi.fn(),
      remove: vi.fn(),
      rectToPathData: vi.fn(),
      createSVGMatrix: vi.fn().mockReturnValue({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0,
        multiply: vi.fn().mockReturnThis(),
      }),
    },
    Util: {
      bbox: vi.fn(),
      transformRectangle: vi.fn(),
    },
    Vector: {
      create: vi.fn(),
    },
    ObjectExt: {
      defaultsDeep: vi.fn((target, ...sources) => {
        return Object.assign({}, target, ...sources)
      }),
    },
  }
})

vi.mock('../../../src/config', () => ({
  Config: {
    prefix: (className: string) => `x6-${className}`,
  },
}))

describe('Stroke Highlighter', () => {
  let mockCellView: any
  let mockMagnet: any
  let mockOptions: any
  let mockPath: any
  let mockVector: any

  beforeEach(() => {
    mockPath = document.createElement('path')
    mockPath.setAttribute = vi.fn()
    mockMagnet = {
      id: 'test-magnet',
      tagName: 'rect',
    }

    const container = document.createElement('svg')

    container.appendChild = vi.fn()

    mockCellView = {
      isEdgeElement: vi.fn().mockReturnValue(false),
      container: container,
      cell: {
        on: vi.fn(),
        model: {
          on: vi.fn(),
        },
      },
    }

    mockOptions = {
      padding: 3,
      rx: 0,
      ry: 0,
      attrs: {
        'stroke-width': 3,
        stroke: '#FEB663',
      },
    }

    mockVector = {
      toPathData: vi.fn().mockReturnValue('M0,0 L100,100'),
      getTransformToElement: vi.fn().mockReturnValue({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0,
        multiply: vi.fn().mockReturnThis(),
      }),
      node: mockMagnet,
    }

    vi.mocked(Vector.create).mockReturnValue(mockVector as any)
    vi.mocked(Dom.createSvgElement).mockReturnValue(mockPath as any)
    vi.mocked(Util.bbox).mockReturnValue({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    })
    vi.mocked(Util.transformRectangle).mockReturnValue({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    })
    vi.mocked(Dom.kebablizeAttrs).mockReturnValue(mockOptions.attrs)

    vi.clearAllMocks()
  })

  describe('highlight', () => {
    it('应该为普通元素创建高亮路径', () => {
      stroke.highlight(mockCellView, mockMagnet, mockOptions)

      expect(Vector.create).toHaveBeenCalledWith(mockMagnet)
      expect(Dom.createSvgElement).toHaveBeenCalledWith('path')
      expect(Dom.attr).toHaveBeenCalledWith(
        mockPath,
        expect.objectContaining({
          d: 'M0,0 L100,100',
          'pointer-events': 'none',
          'vector-effect': 'non-scaling-stroke',
          fill: 'none',
        }),
      )
      expect(mockCellView.container.appendChild).toHaveBeenCalledWith(mockPath)
    })

    it('应该处理没有 attrs 选项的情况', () => {
      const optionsWithoutAttrs = { padding: 3 }
      vi.mocked(Dom.kebablizeAttrs).mockReturnValue({})

      stroke.highlight(mockCellView, mockMagnet, optionsWithoutAttrs)

      expect(Dom.attr).toHaveBeenCalledWith(
        mockPath,
        expect.objectContaining({
          d: 'M0,0 L100,100',
          'pointer-events': 'none',
          'vector-effect': 'non-scaling-stroke',
          fill: 'none',
        }),
      )
    })

    it('应该处理没有 padding 的情况', () => {
      const optionsWithoutPadding = { attrs: mockOptions.attrs }
      stroke.highlight(mockCellView, mockMagnet, optionsWithoutPadding)

      expect(Dom.attr).toHaveBeenCalledWith(
        mockPath,
        expect.objectContaining({
          d: 'M0,0 L100,100',
        }),
      )
    })
  })

  describe('unhighlight', () => {
    it('应该调用私有移除函数', () => {
      expect(() => {
        stroke.unhighlight(mockCellView, mockMagnet, mockOptions)
      }).not.toThrow()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})
