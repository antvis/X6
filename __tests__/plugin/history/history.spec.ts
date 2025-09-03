import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Graph } from '../../../src/graph'
import { Model } from '../../../src/model'
import { History } from '../../../src/plugin/history'

describe('History Plugin', () => {
  let graph: Graph
  let model: Model
  let history: History
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'graph-container'
    document.body.appendChild(container)
    model = new Model()
    graph = new Graph({
      container,
      model,
      trigger: vi.fn(),
    })
    history = new History({ stackSize: 2 })
    history.init(graph)
  })

  it('should be enabled by default', () => {
    expect(history.isEnabled()).toBe(true)
  })

  it('enable / disable / toggleEnabled works', () => {
    history.disable()
    expect(history.isEnabled()).toBe(false)
    history.enable()
    expect(history.isEnabled()).toBe(true)
    history.toggleEnabled(false)
    expect(history.isEnabled()).toBe(false)
    history.toggleEnabled()
    expect(history.isEnabled()).toBe(true)
  })

  it('undo / redo / cancel should work', () => {
    const cmd = history['createCommand']()
    cmd.event = 'cell:added'
    cmd.data = { id: 'n1', props: { id: 'n1' } }
    history['undoStackPush'](cmd)

    expect(history.canUndo()).toBe(true)
    history.undo()
    expect(history.canRedo()).toBe(true)
    history.redo()
    expect(history.getUndoSize()).toBe(1)

    history.cancel()
    expect(history.getUndoSize()).toBe(0)
    expect(history.getRedoSize()).toBe(0)
  })

  it('stackSize should limit undoStack', () => {
    const cmd1 = history['createCommand']()
    cmd1.event = 'cell:added'
    cmd1.data = { id: 'n1', props: { id: 'n1' } }
    const cmd2 = history['createCommand']()
    cmd2.event = 'cell:added'
    cmd2.data = { id: 'n2', props: { id: 'n2' } }
    const cmd3 = history['createCommand']()
    cmd3.event = 'cell:added'
    cmd3.data = { id: 'n3', props: { id: 'n3' } }

    history['undoStackPush'](cmd1)
    history['undoStackPush'](cmd2)
    history['undoStackPush'](cmd3)
    expect(history.getUndoSize()).toBe(2) // stackSize = 2
  })

  it('batch commands should execute correctly', () => {
    const cmd = history['createCommand']({ batch: true })
    cmd.event = 'cell:added'
    cmd.data = { id: 'n1', props: { id: 'n1' } }
    history['batchCommands'] = [cmd]

    history['storeBatchCommand']({})
    expect(history.getUndoSize()).toBe(1)
    expect(history.getRedoSize()).toBe(0)
  })

  it('addCommand respects ignore options and beforeAddCommand', () => {
    const node = model.addNode({ id: 'n1' })
    const spy = vi.spyOn(history, 'push')
    history.options.ignoreAdd = true
    history['addCommand']('cell:added', { cell: node, options: {} } as any)
    expect(spy).not.toHaveBeenCalled()

    history.options.ignoreAdd = false
    history.options.beforeAddCommand = () => false
    history['addCommand']('cell:added', { cell: node, options: {} } as any)
    expect(spy).not.toHaveBeenCalled()
  })

  it('executeCommand handles add/remove/change and custom executeCommand', () => {
    const node = model.addNode({ id: 'n1' })
    const cmdAdd = {
      event: 'cell:added',
      data: { id: node.id, props: node.toJSON() },
      batch: false,
    }
    const cmdRemove = {
      event: 'cell:removed',
      data: { id: node.id, props: node.toJSON() },
      batch: false,
    }
    const cmdChange = {
      event: 'cell:change:attrs',
      data: { id: node.id, key: 'attrs', prev: { a: 1 }, next: { a: 2 } },
      batch: false,
    }

    history['executeCommand'](cmdAdd as any, false, {})
    history['executeCommand'](cmdRemove as any, true, {})
    history['executeCommand'](cmdChange as any, false, {})

    const spyCustom = vi.fn()
    history.options.executeCommand = spyCustom
    const cmdCustom = {
      event: 'custom',
      data: { id: node.id, props: node.toJSON() },
      batch: false,
    }
    history['executeCommand'](cmdCustom as any, false, {})
    expect(spyCustom).toHaveBeenCalled()
  })

  it('ensureUndefinedAttrs works recursively', () => {
    const oldAttrs = { a: 1, b: { c: 2 } }
    const newAttrs = { b: {} }
    const result = history['ensureUndefinedAttrs'](newAttrs, oldAttrs)
    expect(result).toBe(true)
    expect(newAttrs).toEqual({ a: undefined, b: { c: undefined } })
  })

  it('notify triggers events and graph triggers', () => {
    const spyEmit = vi.spyOn(history, 'emit')
    const spyTrigger = vi.spyOn(graph, 'trigger')
    const cmd = history['createCommand']()
    history['notify']('add', cmd, {})
    expect(spyEmit).toHaveBeenCalled()
    expect(spyTrigger).toHaveBeenCalled()
  })

  it('validator validates and emits invalid', () => {
    const validator = history.validator
    const cmd = history['createCommand']()
    cmd.options = { validation: false }
    const spyInvalid = vi.spyOn(validator, 'emit')
    validator['isValidCommand'](cmd as any)
    expect(spyInvalid).not.toHaveBeenCalled()

    validator.validate('cell:added', (err, c, next) => next(null))
    expect(validator['map']['cell:added']).toHaveLength(1)
  })

  it('dispose cleans everything', () => {
    const spyClean = vi.spyOn(history, 'clean')
    const spyStopListening = vi.spyOn(history, 'stopListening')
    history.dispose()
    expect(spyClean).toHaveBeenCalled()
    expect(spyStopListening).toHaveBeenCalled()
  })
  it('undo/redo/cancel with commands', () => {
    const cmd = history['createCommand']()
    history['undoStackPush'](cmd)

    // undo
    const spyUndo = vi.spyOn(history, 'revertCommand')
    history.undo()
    expect(spyUndo).toHaveBeenCalledWith(cmd, {})

    // redo
    const spyRedo = vi.spyOn(history, 'applyCommand')
    history.redo()
    expect(spyRedo).toHaveBeenCalledWith(cmd, {})

    // cancel
    const spyCancel = vi.spyOn(history, 'revertCommand')
    history.cancel()
    expect(spyCancel).toHaveBeenCalledWith(cmd, {})
    expect(history.getRedoSize()).toBe(0)
  })

  it('batch command store and consolidate', () => {
    const cmd1 = history['createCommand']({ batch: true })
    const cmd2 = history['createCommand']({ batch: true })
    history['batchCommands'] = [cmd1, cmd2]

    // batch level > 0
    history['batchLevel'] = 1
    history['storeBatchCommand']({})
    expect(history['batchLevel']).toBe(0)
    expect(history['batchCommands']).not.toBeNull()

    // batch level 0 -> push undoStack
    history['batchLevel'] = 0
    history['storeBatchCommand']({})
    expect(history.getUndoSize()).toBe(0)
  })

  it('consolidateCommands merges move+embed', () => {
    const cmdMove = [
      {
        event: 'cell:change:position',
        batch: true,
        options: { ui: true },
        data: { key: 'position', prev: {}, next: {} },
      },
    ]
    const cmdParentChild = [
      {
        event: 'cell:change:parent',
        batch: true,
        options: { ui: true },
        data: { key: 'parent', prev: {}, next: {} },
      },
      {
        event: 'cell:change:children',
        batch: true,
        options: { ui: true },
        data: { key: 'children', prev: {}, next: {} },
      },
    ]
    history['undoStack'] = [cmdMove, cmdParentChild]
    history['consolidateCommands']()
    expect(history.getUndoSize()).toBe(1)
  })

  it('Validator triggers invalid event', () => {
    const validator = history.validator
    const spy = vi.fn()
    validator.on('invalid', spy)
    validator.validate('cell:added', (err, cmd, next) => {
      throw new Error('invalid')
    })
    const cmd = history['createCommand']()
    cmd.event = 'cell:added'
    history['push'](cmd, {})
    expect(spy).toHaveBeenCalled()
  })
  it('executeCommand triggers add/remove/change events', () => {
    const mockCell = {
      id: '1',
      remove: vi.fn(),
      prop: vi.fn(),
      isNode: () => true,
      isEdge: () => false,
      previous: vi.fn().mockReturnValue(1), // 用于 addCommand 获取 prev
    }
    graph.model.getCell = vi.fn().mockReturnValue(mockCell)
    const nodeCmd = history['createCommand']()
    nodeCmd.event = 'cell:added'
    nodeCmd.data = { id: '1', node: true, props: {} }
    history['executeCommand'](nodeCmd, false, {})

    const removeCmd = history['createCommand']()
    removeCmd.event = 'cell:removed'
    removeCmd.data = { id: '1', node: true, props: {} }
    history['executeCommand'](removeCmd, true, {})

    const changeCmd = history['createCommand']()
    changeCmd.event = 'cell:change:attrs'
    changeCmd.data = {
      id: '1',
      key: 'attrs',
      prev: { a: 1 },
      next: { a: 2 },
    }
    history['executeCommand'](changeCmd, false, {})
    // should trigger cell.prop
    expect(graph.model.getCell().prop).toHaveBeenCalled()
  })

  it('ensureUndefinedAttrs marks dirty when prev key missing', () => {
    const newAttrs = { a: 1 }
    const oldAttrs = { a: 1, b: 2 }
    const dirty = history['ensureUndefinedAttrs'](newAttrs, oldAttrs)
    expect(dirty).toBe(true)
    expect(newAttrs.b).toBeUndefined()
  })

  it('beforeAddCommand prevents push', () => {
    const history2 = new History({ beforeAddCommand: () => false })
    history2.init(graph)
    const cmd = history2['createCommand']()
    // spy push to ensure not called
    const spy = vi.spyOn(history2 as any, 'push')
    history2['addCommand']('cell:added', {
      cell: { id: '1', toJSON: () => ({}) },
    })
    expect(spy).not.toHaveBeenCalled()
  })

  it('freezed prevents addCommand', () => {
    history['freezed'] = true
    const spy = vi.spyOn(history as any, 'createCommand')
    history['addCommand']('cell:added', {
      cell: { id: '1', toJSON: () => ({}) },
    })
    expect(spy).not.toHaveBeenCalled()
  })
})
