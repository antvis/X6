import { describe, expect, it, vi } from 'vitest'
import { Point } from '../../../src/geometry/point'
import { edgeToolRegistry, nodeToolRegistry } from '../../../src/registry/tool'

describe('CellEditor', () => {
  it('NodeEditor creates editable div with text cursor on dblclick', () => {
    const cell: any = {
      isNode: vi.fn().mockReturnValue(true),
      isEdge: vi.fn().mockReturnValue(false),
      getBBox: vi.fn().mockReturnValue({
        width: 100,
        topLeft: new Point(0, 0),
        center: new Point(50, 50),
      }),
      attr: vi.fn().mockImplementation((path: string, value?: any) => {
        if (value === undefined) return 'initial'
      }),
    }

    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      view: { guard: vi.fn().mockReturnValue(false) },
    }

    const cellView: any = {
      graph,
      cell,
      on: vi.fn(),
      container: document.createElement('div'),
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }

    const NodeEditorCtor: any = nodeToolRegistry.get('node-editor')
    const editor = new NodeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()

    const evt: any = {
      stopPropagation: vi.fn(),
      target: document.createElement('div'),
    }
    ;(editor as any).onCellDblClick({ e: evt })

    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    expect(el).toBeTruthy()
    expect(el.contentEditable).toBe('true')
    expect(el.style.cursor).toBe('text')
    expect(el.style.transform).toContain('translate(-50%, -50%)')
  })

  it('EdgeEditor creates editable div with text cursor on dblclick', () => {
    const cell: any = {
      isNode: vi.fn().mockReturnValue(false),
      isEdge: vi.fn().mockReturnValue(true),
    }

    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      clientToLocal: vi.fn().mockReturnValue(new Point(100, 80)),
      view: { guard: vi.fn().mockReturnValue(false) },
    }

    const cellView: any = {
      graph,
      cell,
      on: vi.fn(),
      container: document.createElement('div'),
      path: { closestPointLength: vi.fn().mockReturnValue(0.5) },
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }

    const EdgeEditorCtor: any = edgeToolRegistry.get('edge-editor')
    const editor = new EdgeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()

    const parent = document.createElement('div')
    const target = document.createElement('div')
    parent.appendChild(target)
    const evt: any = {
      stopPropagation: vi.fn(),
      clientX: 300,
      clientY: 200,
      target,
    }
    ;(editor as any).onCellDblClick({ e: evt })

    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    expect(el).toBeTruthy()
    expect(el.contentEditable).toBe('true')
    expect(el.style.cursor).toBe('text')
    expect(el.style.transform).toContain('translate(-50%, -50%)')
  })
  it('onRender attaches dblclick listener and onRemove detaches', () => {
    const cell: any = {
      isNode: vi.fn().mockReturnValue(true),
      isEdge: vi.fn().mockReturnValue(false),
      getBBox: vi.fn().mockReturnValue({
        width: 100,
        topLeft: new Point(0, 0),
        center: new Point(50, 50),
      }),
      attr: vi.fn(),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell,
      on: vi.fn(),
      off: vi.fn(),
      container: document.createElement('div'),
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const NodeEditorCtor: any = nodeToolRegistry.get('node-editor')
    const editor = new NodeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()
    expect(cellView.on).toHaveBeenCalledWith(
      'cell:dblclick',
      expect.any(Function),
    )
    ;(editor as any).onRemove()
    expect(cellView.off).toHaveBeenCalledWith(
      'cell:dblclick',
      expect.any(Function),
    )
  })

  it('updateNodeEditorTransform center and font styles applied', () => {
    const cell: any = {
      isNode: vi.fn().mockReturnValue(true),
      isEdge: vi.fn().mockReturnValue(false),
      getBBox: vi.fn().mockReturnValue({
        width: 120,
        topLeft: new Point(0, 0),
        center: new Point(60, 40),
      }),
      attr: vi.fn().mockReturnValue('text'),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 2, sy: 2 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell,
      on: vi.fn(),
      container: document.createElement('div'),
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const NodeEditorCtor: any = nodeToolRegistry.get('node-editor')
    const editor = new NodeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()
    ;(editor as any).onCellDblClick({
      e: { stopPropagation: vi.fn(), target: document.createElement('div') },
    })
    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    expect(el.style.transform).toContain('scale(2, 2)')
    expect(el.style.transform).toContain('translate(-50%, -50%)')
    expect(el.style.minWidth).toBe('116px')
    expect(el.style.fontSize).toBe('14px')
    expect(el.style.fontFamily).toContain('Arial')
    expect(el.style.color).toBe('rgb(0, 0, 0)')
  })

  it('updateNodeEditorTransform with x/y and width/height', () => {
    const cell: any = {
      isNode: vi.fn().mockReturnValue(true),
      isEdge: vi.fn().mockReturnValue(false),
      getBBox: vi.fn().mockReturnValue({
        width: 200,
        topLeft: new Point(10, 10),
        center: new Point(110, 110),
      }),
      attr: vi.fn(),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1.5, sy: 1.2 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell,
      on: vi.fn(),
      container: document.createElement('div'),
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const NodeEditorCtor: any = nodeToolRegistry.get('node-editor')
    const editor = new NodeEditorCtor({ x: 0.1, y: 0.2, width: 80, height: 20 })
    editor.config(cellView, toolsView)
    editor.render()
    ;(editor as any).onCellDblClick({
      e: { stopPropagation: vi.fn(), target: document.createElement('div') },
    })
    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    expect(el.style.transform).toContain('scale(1.5, 1.2)')
    expect(el.style.transform).not.toContain('translate(-50%, -50%)')
    expect(el.style.width).toBe('80px')
    expect(el.style.height).toBe('20px')
  })

  it('getText function variant and setText function variant used', () => {
    const cell: any = {
      isNode: vi.fn().mockReturnValue(true),
      isEdge: vi.fn().mockReturnValue(false),
      getBBox: vi.fn().mockReturnValue({
        width: 100,
        topLeft: new Point(0, 0),
        center: new Point(50, 50),
      }),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell,
      on: vi.fn(),
      container: document.createElement('div'),
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const setText = vi.fn()
    const NodeEditorCtor: any = nodeToolRegistry.get('node-editor')
    const editor = new NodeEditorCtor({ getText: () => 'funcText', setText })
    editor.config(cellView, toolsView)
    editor.render()
    ;(editor as any).onCellDblClick({
      e: { stopPropagation: vi.fn(), target: document.createElement('div') },
    })
    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    expect(el.innerText).toBe('funcText')
    expect(setText).toHaveBeenCalledWith({
      cell,
      value: '',
      index: -1,
      distance: 0.5,
    })
  })

  it('updateCell writes value and removes editor on mouseup and mouseleave', () => {
    const cell: any = {
      isNode: vi.fn().mockReturnValue(true),
      isEdge: vi.fn().mockReturnValue(false),
      getBBox: vi.fn().mockReturnValue({
        width: 100,
        topLeft: new Point(0, 0),
        center: new Point(50, 50),
      }),
      attr: vi.fn(),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell,
      on: vi.fn(),
      container: document.createElement('div'),
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const NodeEditorCtor: any = nodeToolRegistry.get('node-editor')
    const editor = new NodeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()
    ;(editor as any).onCellDblClick({
      e: { stopPropagation: vi.fn(), target: document.createElement('div') },
    })
    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    el.innerText = 'hello\n'
    ;(editor as any).onDocumentMouseUp({
      target: document.createElement('div'),
    } as any)
    expect(cell.attr).toHaveBeenCalledWith('text/text', 'hello')
    const after = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    )
    expect(after).toBeNull()
    ;(editor as any).onCellDblClick({
      e: { stopPropagation: vi.fn(), target: document.createElement('div') },
    })
    const el2 = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    el2.innerText = 'world\n'
    ;(editor as any).onMouseLeave()
    expect(cell.attr).toHaveBeenCalledWith('text/text', 'world')
  })

  it('onMouseDown stops propagation and autoFocus selects text', () => {
    vi.useFakeTimers()
    const cell: any = {
      isNode: vi.fn().mockReturnValue(true),
      isEdge: vi.fn().mockReturnValue(false),
      getBBox: vi.fn().mockReturnValue({
        width: 100,
        topLeft: new Point(0, 0),
        center: new Point(50, 50),
      }),
      attr: vi.fn(),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell,
      on: vi.fn(),
      container: document.createElement('div'),
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const NodeEditorCtor: any = nodeToolRegistry.get('node-editor')
    const editor = new NodeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()
    const e: any = { stopPropagation: vi.fn() }
    ;(editor as any).onMouseDown(e)
    expect(e.stopPropagation).toHaveBeenCalled()
    const getSel = vi
      .spyOn(window, 'getSelection' as any)
      .mockReturnValue({ removeAllRanges: vi.fn(), addRange: vi.fn() } as any)
    ;(editor as any).onCellDblClick({
      e: { stopPropagation: vi.fn(), target: document.createElement('div') },
    })
    vi.runAllTimers()
    expect(getSel).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('EdgeEditor labelAddable branch appends new label', () => {
    const edge: any = {
      isNode: vi.fn().mockReturnValue(false),
      isEdge: vi.fn().mockReturnValue(true),
      appendLabel: vi.fn(),
      prop: vi.fn(),
      removeLabelAt: vi.fn(),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      clientToLocal: vi.fn().mockReturnValue(new Point(10, 20)),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell: edge,
      on: vi.fn(),
      container: document.createElement('div'),
      path: { closestPointLength: vi.fn().mockReturnValue(0.7) },
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const EdgeEditorCtor: any = edgeToolRegistry.get('edge-editor')
    const editor = new EdgeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()
    const target = document.createElement('div')
    ;(editor as any).onCellDblClick({
      e: { stopPropagation: vi.fn(), clientX: 100, clientY: 200, target },
    })
    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    el.innerText = 'abc\n'
    ;(editor as any).onDocumentMouseUp({
      target: document.createElement('span'),
    } as any)
    expect(edge.appendLabel).toHaveBeenCalled()
    const arg = edge.appendLabel.mock.calls[0][0]
    expect(arg.position.distance).toBe(0.7)
  })

  it('EdgeEditor edits existing label when clicking an edge label', () => {
    const edge: any = {
      isNode: vi.fn().mockReturnValue(false),
      isEdge: vi.fn().mockReturnValue(true),
      appendLabel: vi.fn(),
      prop: vi.fn(),
      removeLabelAt: vi.fn(),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      clientToLocal: vi.fn().mockReturnValue(new Point(10, 20)),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell: edge,
      on: vi.fn(),
      container: document.createElement('div'),
      path: { closestPointLength: vi.fn().mockReturnValue(0.7) },
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const EdgeEditorCtor: any = edgeToolRegistry.get('edge-editor')
    const editor = new EdgeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()
    const parent = document.createElement('div')
    parent.classList.add('x6-edge-label')
    parent.setAttribute('data-index', '2')
    parent.setAttribute('transform', 'translate(15 25)')
    const target = document.createElement('span')
    parent.appendChild(target)
    ;(editor as any).onCellDblClick({ e: { stopPropagation: vi.fn(), target } })
    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    el.innerText = 'xyz\n'
    ;(editor as any).onDocumentMouseUp({
      target: document.createElement('div'),
    } as any)
    expect(edge.prop).toHaveBeenCalledWith('labels/2/attrs/label/text', 'xyz')
  })

  it('EdgeEditor removes label when value is null', () => {
    const edge: any = {
      isNode: vi.fn().mockReturnValue(false),
      isEdge: vi.fn().mockReturnValue(true),
      appendLabel: vi.fn(),
      prop: vi.fn(),
      removeLabelAt: vi.fn(),
    }
    const graph: any = {
      scale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      localToGraph: vi.fn().mockImplementation((p: Point) => p),
      clientToLocal: vi.fn().mockReturnValue(new Point(10, 20)),
      view: { guard: vi.fn().mockReturnValue(false) },
    }
    const cellView: any = {
      graph,
      cell: edge,
      on: vi.fn(),
      container: document.createElement('div'),
      path: { closestPointLength: vi.fn().mockReturnValue(0.7) },
    }
    const toolsView: any = { focus: vi.fn(), blur: vi.fn() }
    const EdgeEditorCtor: any = edgeToolRegistry.get('edge-editor')
    const editor = new EdgeEditorCtor()
    editor.config(cellView, toolsView)
    editor.render()
    ;(editor as any).onCellDblClick({
      e: { stopPropagation: vi.fn(), target: document.createElement('div') },
    })
    ;(editor as any).labelIndex = 1
    const el = (editor as any).container.querySelector(
      '.x6-cell-tool-editor',
    ) as HTMLDivElement
    el.innerText = ''
    ;(editor as any).updateCell()
    expect(edge.removeLabelAt).toHaveBeenCalledWith(1)
  })

  it('defaults of NodeEditor and EdgeEditor', () => {
    const NodeEditorCtor: any = nodeToolRegistry.get('node-editor')
    const EdgeEditorCtor: any = edgeToolRegistry.get('edge-editor')
    const nodeDefaults = NodeEditorCtor.getDefaults()
    const edgeDefaults = EdgeEditorCtor.getDefaults()
    expect(nodeDefaults.tagName).toBe('div')
    expect(nodeDefaults.isSVGElement).toBe(false)
    expect(edgeDefaults.tagName).toBe('div')
    expect(edgeDefaults.isSVGElement).toBe(false)
    expect(nodeDefaults.attrs.fontSize).toBe(14)
    expect(edgeDefaults.labelAddable).toBe(true)
  })
})
