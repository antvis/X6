import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HighlightManager } from '../../src/graph/highlight'
import { Graph } from '../../src/graph'
import { Highlighter } from '../../src/registry'

describe('HighlightManager', () => {
  let graph: Graph
  let manager: HighlightManager
  let cellView: any
  let magnet: HTMLElement
  let highlighter: any

  beforeEach(() => {
    graph = new Graph({ container: document.createElement('div') })
    manager = new HighlightManager(graph)
    cellView = {}
    magnet = document.createElement('div')
    magnet.id = 'magnet1'
    highlighter = {
      highlight: vi.fn(),
      unhighlight: vi.fn(),
    }
    // mock registry
    vi.spyOn(Highlighter.registry, 'get').mockReturnValue(highlighter)
    vi.spyOn(Highlighter, 'check').mockImplementation(() => {})
  })

  it('init should start listening', () => {
    const startSpy = vi.spyOn(manager as any, 'startListening')
    manager['init']()
    expect(startSpy).toHaveBeenCalled()
  })

  it('startListening should bind events', () => {
    const onSpy = vi.spyOn(graph, 'on')
    manager['startListening']()
    expect(onSpy).toHaveBeenCalledWith(
      'cell:highlight',
      manager['onCellHighlight'],
      manager,
    )
    expect(onSpy).toHaveBeenCalledWith(
      'cell:unhighlight',
      manager['onCellUnhighlight'],
      manager,
    )
  })

  it('stopListening should unbind events', () => {
    const offSpy = vi.spyOn(graph, 'off')
    manager['stopListening']()
    expect(offSpy).toHaveBeenCalledWith(
      'cell:highlight',
      manager['onCellHighlight'],
      manager,
    )
    expect(offSpy).toHaveBeenCalledWith(
      'cell:unhighlight',
      manager['onCellUnhighlight'],
      manager,
    )
  })

  it('onCellHighlight should create new highlight', () => {
    manager['onCellHighlight']({
      view: cellView,
      magnet,
      options: { highlighter: 'test' },
    })
    const keys = Object.keys(manager['highlights'])
    expect(keys.length).toBe(1)
    expect(highlighter.highlight).toHaveBeenCalledWith(cellView, magnet, {})
  })

  it('onCellHighlight should skip if highlight exists', () => {
    const id = manager['getHighlighterId'](magnet, {
      name: 'test',
      highlighter,
      args: {},
    })
    manager['highlights'][id] = { cellView, magnet, highlighter, args: {} }
    manager['onCellHighlight']({
      view: cellView,
      magnet,
      options: { highlighter: 'test' },
    })
    expect(highlighter.highlight).not.toHaveBeenCalled()
  })

  it('onCellHighlight should return if resolveHighlighter is null', () => {
    vi.spyOn(manager as any, 'resolveHighlighter').mockReturnValue(null)
    manager['onCellHighlight']({ view: cellView, magnet, options: {} })
  })

  it('onCellUnhighlight should call unhighlight', () => {
    const id = manager['getHighlighterId'](magnet, {
      name: 'test',
      highlighter,
      args: {},
    })
    manager['highlights'][id] = { cellView, magnet, highlighter, args: {} }
    manager['onCellUnhighlight']({ magnet, options: { highlighter: 'test' } })
    expect(highlighter.unhighlight).toHaveBeenCalledWith(cellView, magnet, {})
    expect(manager['highlights'][id]).toBeUndefined()
  })

  it('onCellUnhighlight should return if resolveHighlighter is null', () => {
    vi.spyOn(manager as any, 'resolveHighlighter').mockReturnValue(null)
    manager['onCellUnhighlight']({ magnet, options: {} })
  })

  it('resolveHighlighter with string name', () => {
    const result = manager['resolveHighlighter']({ highlighter: 'test' })
    expect(result).toMatchObject({ name: 'test', highlighter })
  })

  it('resolveHighlighter with object', () => {
    const result = manager['resolveHighlighter']({
      highlighter: { name: 'test', args: { foo: 1 } },
    })
    expect(result.args).toEqual({ foo: 1 })
  })

  it('getHighlighterId should return string containing magnet id', () => {
    const id = manager['getHighlighterId'](magnet, {
      name: 'test',
      highlighter,
      args: {},
    })
    expect(id).toContain('magnet1')
    expect(id).toContain('test')
  })

  it('unhighlight should skip if highlight not exist', () => {
    manager['unhighlight']('nonexistent')
  })

  it('dispose should unhighlight all and stop listening', () => {
    const id = manager['getHighlighterId'](magnet, {
      name: 'test',
      highlighter,
      args: {},
    })
    manager['highlights'][id] = { cellView, magnet, highlighter, args: {} }
    const stopSpy = vi.spyOn(manager as any, 'stopListening')
    manager.dispose()
    expect(highlighter.unhighlight).toHaveBeenCalledWith(cellView, magnet, {})
    expect(manager['highlights'][id]).toBeUndefined()
    expect(stopSpy).toHaveBeenCalled()
  })
})
