import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Graph } from '@/graph'
import { History } from '@/plugin/history'
import '@/plugin/history/api'

describe('Graph History API', () => {
  let graph: Graph
  let mockHistory: Partial<History>

  beforeEach(() => {
    graph = new Graph({ container: document.createElement('div') })
    mockHistory = {
      isEnabled: vi.fn().mockReturnValue(true),
      enable: vi.fn(),
      disable: vi.fn(),
      toggleEnabled: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      cancel: vi.fn(),
      canUndo: vi.fn().mockReturnValue(true),
      canRedo: vi.fn().mockReturnValue(false),
      clean: vi.fn(),
      getSize: vi.fn().mockReturnValue(10),
      getUndoSize: vi.fn().mockReturnValue(5),
      getRedoSize: vi.fn().mockReturnValue(2),
      getUndoRemainSize: vi.fn().mockReturnValue(5),
    }
    // mock getPlugin
    vi.spyOn(graph, 'getPlugin').mockImplementation((name: string) => {
      if (name === 'history') return mockHistory
      return undefined
    })
  })

  it('isHistoryEnabled returns status', () => {
    expect(graph.isHistoryEnabled()).toBe(true)
    expect(mockHistory.isEnabled).toHaveBeenCalled()
  })

  it('enableHistory calls history.enable', () => {
    const ret = graph.enableHistory()
    expect(mockHistory.enable).toHaveBeenCalled()
    expect(ret).toBe(graph)
  })

  it('disableHistory calls history.disable', () => {
    const ret = graph.disableHistory()
    expect(mockHistory.disable).toHaveBeenCalled()
    expect(ret).toBe(graph)
  })

  it('toggleHistory calls history.toggleEnabled', () => {
    const ret = graph.toggleHistory(true)
    expect(mockHistory.toggleEnabled).toHaveBeenCalledWith(true)
    expect(ret).toBe(graph)
  })

  it('undo calls history.undo', () => {
    const options = { test: 1 }
    const ret = graph.undo(options)
    expect(mockHistory.undo).toHaveBeenCalledWith(options)
    expect(ret).toBe(graph)
  })

  it('redo calls history.redo', () => {
    const options = { test: 2 }
    const ret = graph.redo(options)
    expect(mockHistory.redo).toHaveBeenCalledWith(options)
    expect(ret).toBe(graph)
  })

  it('undoAndCancel calls history.cancel', () => {
    const options = { test: 3 }
    const ret = graph.undoAndCancel(options)
    expect(mockHistory.cancel).toHaveBeenCalledWith(options)
    expect(ret).toBe(graph)
  })

  it('canUndo returns history.canUndo value', () => {
    expect(graph.canUndo()).toBe(true)
    expect(mockHistory.canUndo).toHaveBeenCalled()
  })

  it('canRedo returns history.canRedo value', () => {
    expect(graph.canRedo()).toBe(false)
    expect(mockHistory.canRedo).toHaveBeenCalled()
  })

  it('cleanHistory calls history.clean', () => {
    const options = { test: 4 }
    const ret = graph.cleanHistory(options)
    expect(mockHistory.clean).toHaveBeenCalledWith(options)
    expect(ret).toBe(graph)
  })

  it('getHistoryStackSize returns history.getSize', () => {
    expect(graph.getHistoryStackSize()).toBe(10)
    expect(mockHistory.getSize).toHaveBeenCalled()
  })

  it('getUndoStackSize returns history.getUndoSize', () => {
    expect(graph.getUndoStackSize()).toBe(5)
    expect(mockHistory.getUndoSize).toHaveBeenCalled()
  })

  it('getRedoStackSize returns history.getRedoSize', () => {
    expect(graph.getRedoStackSize()).toBe(2)
    expect(mockHistory.getRedoSize).toHaveBeenCalled()
  })

  it('getUndoRemainSize returns history.getUndoRemainSize', () => {
    expect(graph.getUndoRemainSize()).toBe(5)
    expect(mockHistory.getUndoRemainSize).toHaveBeenCalled()
  })
})
