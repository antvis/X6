import {
  Basecoat,
  disposable,
  FunctionExt,
  type KeyValue,
  ObjectExt,
} from '../../common'
import type { Graph } from '../../graph'
import { Model } from '../../model'
import type {
  HistoryChangingData,
  HistoryCommand,
  HistoryCommands,
  HistoryCommonOptions,
  HistoryCreationData,
  HistoryEventArgs,
  HistoryModelEvents,
  HistoryOptions,
} from './type'
import {
  getOptions,
  isAddEvent,
  isChangeEvent,
  isRemoveEvent,
  sortBatchCommands,
} from './util'
import { Validator, type ValidatorCallback } from './validator'
import './api'

export class History
  extends Basecoat<HistoryEventArgs>
  implements Graph.Plugin
{
  public name = 'history'
  public graph: Graph
  public model: Model
  public readonly options: HistoryCommonOptions
  public readonly validator: Validator
  protected redoStack: HistoryCommands[]
  protected undoStack: HistoryCommands[]
  protected batchCommands: HistoryCommand[] | null = null
  protected batchLevel = 0
  protected lastBatchIndex = -1
  protected freezed = false
  protected stackSize = 0 // 0: not limit

  protected readonly handlers: (<T extends HistoryModelEvents>(
    event: T,
    args: Model.EventArgs[T],
  ) => any)[] = []

  constructor(options: HistoryOptions = {}) {
    super()
    const { stackSize = 0 } = options
    this.stackSize = stackSize
    this.options = getOptions(options)
    this.validator = new Validator({
      history: this,
      cancelInvalid: this.options.cancelInvalid,
    })
  }

  init(graph: Graph) {
    this.graph = graph
    this.model = this.graph.model

    this.clean()
    this.startListening()
  }

  // #region api

  isEnabled() {
    return !this.disabled
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
    }
  }

  toggleEnabled(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isEnabled()) {
        if (enabled) {
          this.enable()
        } else {
          this.disable()
        }
      }
    } else if (this.isEnabled()) {
      this.disable()
    } else {
      this.enable()
    }

    return this
  }

  undo(options: KeyValue = {}) {
    if (!this.disabled) {
      const cmd = this.undoStack.pop()
      if (cmd) {
        this.revertCommand(cmd, options)
        this.redoStack.push(cmd)
        this.notify('undo', cmd, options)
      }
    }
    return this
  }

  redo(options: KeyValue = {}) {
    if (!this.disabled) {
      const cmd = this.redoStack.pop()
      if (cmd) {
        this.applyCommand(cmd, options)
        this.undoStackPush(cmd)
        this.notify('redo', cmd, options)
      }
    }
    return this
  }

  /**
   * Same as `undo()` but does not store the undo-ed command to the
   * `redoStack`. Canceled command therefore cannot be redo-ed.
   */
  cancel(options: KeyValue = {}) {
    if (!this.disabled) {
      const cmd = this.undoStack.pop()
      if (cmd) {
        this.revertCommand(cmd, options)
        this.redoStack = []
        this.notify('cancel', cmd, options)
      }
    }
    return this
  }

  getSize() {
    return this.stackSize
  }

  getUndoRemainSize() {
    const ul = this.undoStack.length
    return this.stackSize - ul
  }

  getUndoSize() {
    return this.undoStack.length
  }

  getRedoSize() {
    return this.redoStack.length
  }

  canUndo() {
    return !this.disabled && this.undoStack.length > 0
  }

  canRedo() {
    return !this.disabled && this.redoStack.length > 0
  }

  clean(options: KeyValue = {}) {
    this.undoStack = []
    this.redoStack = []
    this.notify('clean', null, options)
    return this
  }

  // #endregion

  get disabled() {
    return this.options.enabled !== true
  }

  protected validate(
    events: string | string[],
    ...callbacks: ValidatorCallback[]
  ) {
    this.validator.validate(events, ...callbacks)
    return this
  }

  protected startListening() {
    this.model.on('batch:start', this.initBatchCommand, this)
    this.model.on('batch:stop', this.storeBatchCommand, this)
    if (this.options.eventNames) {
      this.options.eventNames.forEach((name, index) => {
        this.handlers[index] = this.addCommand.bind(this, name)
        this.model.on(name, this.handlers[index])
      })
    }

    this.validator.on('invalid', (args) => this.trigger('invalid', args))
  }

  protected stopListening() {
    this.model.off('batch:start', this.initBatchCommand, this)
    this.model.off('batch:stop', this.storeBatchCommand, this)
    if (this.options.eventNames) {
      this.options.eventNames.forEach((name, index) => {
        this.model.off(name, this.handlers[index])
      })
      this.handlers.length = 0
    }
    this.validator.off('invalid')
  }

  protected createCommand(options?: { batch: boolean }): HistoryCommand {
    return {
      batch: options ? options.batch : false,
      data: {} as HistoryCreationData,
    }
  }

  protected revertCommand(cmd: HistoryCommands, options?: KeyValue) {
    this.freezed = true

    const cmds = Array.isArray(cmd) ? sortBatchCommands(cmd) : [cmd]
    for (let i = cmds.length - 1; i >= 0; i -= 1) {
      const cmd = cmds[i]
      const localOptions = {
        ...options,
        ...ObjectExt.pick(cmd.options, this.options.revertOptionsList || []),
      }
      this.executeCommand(cmd, true, localOptions)
    }

    this.freezed = false
  }

  protected applyCommand(cmd: HistoryCommands, options?: KeyValue) {
    this.freezed = true

    const cmds = Array.isArray(cmd) ? sortBatchCommands(cmd) : [cmd]
    for (let i = 0; i < cmds.length; i += 1) {
      const cmd = cmds[i]
      const localOptions = {
        ...options,
        ...ObjectExt.pick(cmd.options, this.options.applyOptionsList || []),
      }
      this.executeCommand(cmd, false, localOptions)
    }

    this.freezed = false
  }

  protected executeCommand(
    cmd: HistoryCommand,
    revert: boolean,
    options: KeyValue,
  ) {
    const model = this.model
    // const cell = cmd.modelChange ? model : model.getCell(cmd.data.id!)
    const cell = model.getCell(cmd.data.id!)
    const event = cmd.event

    if ((isAddEvent(event) && revert) || (isRemoveEvent(event) && !revert)) {
      cell && cell.remove(options)
    } else if (
      (isAddEvent(event) && !revert) ||
      (isRemoveEvent(event) && revert)
    ) {
      const data = cmd.data as HistoryCreationData
      if (data.node) {
        model.addNode(data.props, options)
      } else if (data.edge) {
        model.addEdge(data.props, options)
      }
    } else if (isChangeEvent(event)) {
      const data = cmd.data as HistoryChangingData
      const key = data.key
      if (key && cell) {
        const value = revert ? data.prev[key] : data.next[key]

        if (data.key === 'attrs') {
          const hasUndefinedAttr = this.ensureUndefinedAttrs(
            value,
            revert ? data.next[key] : data.prev[key],
          )
          if (hasUndefinedAttr) {
            // recognize a `dirty` flag and re-render itself in order to remove
            // the attribute from SVGElement.
            options.dirty = true
          }
        }

        cell.prop(key, value, options)
      }
    } else {
      const executeCommand = this.options.executeCommand
      if (executeCommand) {
        FunctionExt.call(executeCommand, this, cmd, revert, options)
      }
    }
  }

  protected addCommand<T extends keyof Model.EventArgs>(
    event: T,
    args: Model.EventArgs[T],
  ) {
    if (this.freezed || this.disabled) {
      return
    }

    const eventArgs = args as Model.EventArgs['cell:change:*']
    const options = eventArgs.options || {}
    if (options.dryrun) {
      return
    }

    if (
      (isAddEvent(event) && this.options.ignoreAdd) ||
      (isRemoveEvent(event) && this.options.ignoreRemove) ||
      (isChangeEvent(event) && this.options.ignoreChange)
    ) {
      return
    }

    // before
    // ------
    const before = this.options.beforeAddCommand
    if (
      before != null &&
      FunctionExt.call(before, this, event, args) === false
    ) {
      return
    }

    if (event === 'cell:change:*') {
      // eslint-disable-next-line
      event = `cell:change:${eventArgs.key}` as T
    }

    const cell = eventArgs.cell
    const isModelChange = Model.isModel(cell)
    let cmd: HistoryCommand

    if (this.batchCommands) {
      // In most cases we are working with same object, doing
      // same action etc. translate an object piece by piece.
      cmd = this.batchCommands[Math.max(this.lastBatchIndex, 0)]

      // Check if we are start working with new object or performing different
      // action with it. Note, that command is uninitialized when lastCmdIndex
      // equals -1. In that case we are done, command we were looking for is
      // already set

      const diffId =
        (isModelChange && !cmd.modelChange) || cmd.data.id !== cell.id
      const diffName = cmd.event !== event

      if (this.lastBatchIndex >= 0 && (diffId || diffName)) {
        // Trying to find command first, which was performing same
        // action with the object as we are doing now with cell.
        const index = this.batchCommands.findIndex(
          (cmd) =>
            ((isModelChange && cmd.modelChange) || cmd.data.id === cell.id) &&
            cmd.event === event,
        )

        if (index < 0 || isAddEvent(event) || isRemoveEvent(event)) {
          cmd = this.createCommand({ batch: true })
        } else {
          cmd = this.batchCommands[index]
          this.batchCommands.splice(index, 1)
        }
        this.batchCommands.push(cmd)
        this.lastBatchIndex = this.batchCommands.length - 1
      }
    } else {
      cmd = this.createCommand({ batch: false })
    }

    // add & remove
    // ------------
    if (isAddEvent(event) || isRemoveEvent(event)) {
      const data = cmd.data as HistoryCreationData
      cmd.event = event
      cmd.options = options
      data.id = cell.id
      data.props = ObjectExt.cloneDeep(cell.toJSON())
      if (cell.isEdge()) {
        data.edge = true
      } else if (cell.isNode()) {
        data.node = true
      }

      return this.push(cmd, options)
    }

    // change:*
    // --------
    if (isChangeEvent(event)) {
      const key = (args as Model.EventArgs['cell:change:*']).key
      const data = cmd.data as HistoryChangingData

      if (!cmd.batch || !cmd.event) {
        // Do this only once. Set previous data and action (also
        // serves as a flag so that we don't repeat this branche).
        cmd.event = event
        cmd.options = options
        data.key = key as string
        if (data.prev == null) {
          data.prev = {}
        }
        data.prev[key] = ObjectExt.cloneDeep(cell.previous(key))

        if (isModelChange) {
          cmd.modelChange = true
        } else {
          data.id = cell.id
        }
      }

      if (data.next == null) {
        data.next = {}
      }
      data.next[key] = ObjectExt.cloneDeep(cell.prop(key))
      return this.push(cmd, options)
    }

    // others
    // ------
    const afterAddCommand = this.options.afterAddCommand
    if (afterAddCommand) {
      FunctionExt.call(afterAddCommand, this, event, args, cmd)
    }
    this.push(cmd, options)
  }

  /**
   * Gather multiple changes into a single command. These commands could
   * be reverted with single `undo()` call. From the moment the function
   * is called every change made on model is not stored into the undoStack.
   * Changes are temporarily kept until `storeBatchCommand()` is called.
   */
  // eslint-disable-next-line
  protected initBatchCommand(options: KeyValue) {
    if (this.freezed) {
      return
    }
    if (this.batchCommands) {
      this.batchLevel += 1
    } else {
      this.batchCommands = [this.createCommand({ batch: true })]
      this.batchLevel = 0
      this.lastBatchIndex = -1
    }
  }

  /**
   * Store changes temporarily kept in the undoStack. You have to call this
   * function as many times as `initBatchCommand()` been called.
   */
  protected storeBatchCommand(options: KeyValue) {
    if (this.freezed) {
      return
    }

    if (this.batchCommands && this.batchLevel <= 0) {
      const cmds = this.filterBatchCommand(this.batchCommands)
      if (cmds.length > 0) {
        this.redoStack = []
        this.undoStackPush(cmds)
        this.consolidateCommands()
        this.notify('add', cmds, options)
      }
      this.batchCommands = null
      this.lastBatchIndex = -1
      this.batchLevel = 0
    } else if (this.batchCommands && this.batchLevel > 0) {
      this.batchLevel -= 1
    }
  }

  protected filterBatchCommand(batchCommands: HistoryCommand[]) {
    let cmds = batchCommands.slice()
    const result = []

    while (cmds.length > 0) {
      const cmd = cmds.shift()!
      const evt = cmd.event
      const id = cmd.data.id

      if (evt != null && (id != null || cmd.modelChange)) {
        if (isAddEvent(evt)) {
          const index = cmds.findIndex(
            (c) => isRemoveEvent(c.event) && c.data.id === id,
          )

          if (index >= 0) {
            cmds = cmds.filter((c, i) => index < i || c.data.id !== id)
            continue
          }
        } else if (isRemoveEvent(evt)) {
          const index = cmds.findIndex(
            (c) => isAddEvent(c.event) && c.data.id === id,
          )
          if (index >= 0) {
            cmds.splice(index, 1)
            continue
          }
        } else if (isChangeEvent(evt)) {
          const data = cmd.data as HistoryChangingData

          if (ObjectExt.isEqual(data.prev, data.next)) {
            continue
          }
        } else {
          // pass
        }

        result.push(cmd)
      }
    }

    return result
  }

  protected notify(
    event: keyof HistoryEventArgs,
    cmd: HistoryCommands | null,
    options: KeyValue,
  ) {
    const cmds = cmd == null ? null : Array.isArray(cmd) ? cmd : [cmd]
    this.emit(event, { cmds, options })
    this.graph.trigger(`history:${event}`, { cmds, options })
    this.emit('change', { cmds, options })
    this.graph.trigger('history:change', { cmds, options })
  }

  protected push(cmd: HistoryCommand, options: KeyValue) {
    this.redoStack = []
    if (cmd.batch) {
      this.lastBatchIndex = Math.max(this.lastBatchIndex, 0)
      this.emit('batch', { cmd, options })
    } else {
      this.undoStackPush(cmd)
      this.consolidateCommands()
      this.notify('add', cmd, options)
    }
  }

  /**
   * Conditionally combine multiple undo items into one.
   *
   * Currently this is only used combine a `cell:changed:position` event
   * followed by multiple `cell:change:parent` and `cell:change:children`
   * events, such that a "move + embed" action can be undone in one step.
   *
   * See https://github.com/antvis/X6/issues/2421
   *
   * This is an ugly WORKAROUND. It does not solve deficiencies in the batch
   * system itself.
   */
  protected consolidateCommands() {
    const lastCommandGroup = this.undoStack[this.undoStack.length - 1]
    const penultimateCommandGroup = this.undoStack[this.undoStack.length - 2]

    // We are looking for at least one cell:change:parent
    // and one cell:change:children
    if (!Array.isArray(lastCommandGroup)) {
      return
    }
    const eventTypes = new Set(lastCommandGroup.map((cmd) => cmd.event))
    if (
      eventTypes.size !== 2 ||
      !eventTypes.has('cell:change:parent') ||
      !eventTypes.has('cell:change:children')
    ) {
      return
    }

    // We are looking for events from user interactions
    if (!lastCommandGroup.every((cmd) => cmd.batch && cmd.options?.ui)) {
      return
    }

    // We are looking for a command group with exactly one event, whose event
    // type is cell:change:position, and is from user interactions
    if (
      !Array.isArray(penultimateCommandGroup) ||
      penultimateCommandGroup.length !== 1
    ) {
      return
    }
    const maybePositionChange = penultimateCommandGroup[0]
    if (
      maybePositionChange.event !== 'cell:change:position' ||
      !maybePositionChange.options?.ui
    ) {
      return
    }

    // Actually consolidating the commands we get
    penultimateCommandGroup.push(...lastCommandGroup)
    this.undoStack.pop()
  }

  protected undoStackPush(cmd: HistoryCommands) {
    if (this.stackSize === 0) {
      this.undoStack.push(cmd)
      return
    }
    if (this.undoStack.length >= this.stackSize) {
      this.undoStack.shift()
    }
    this.undoStack.push(cmd)
  }

  protected ensureUndefinedAttrs(
    newAttrs: Record<string, any>,
    oldAttrs: Record<string, any>,
  ) {
    let hasUndefinedAttr = false
    if (
      newAttrs !== null &&
      oldAttrs !== null &&
      typeof newAttrs === 'object' &&
      typeof oldAttrs === 'object'
    ) {
      Object.keys(oldAttrs).forEach((key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (newAttrs[key] === undefined && oldAttrs[key] !== undefined) {
          newAttrs[key] = undefined
          hasUndefinedAttr = true
        } else if (
          typeof newAttrs[key] === 'object' &&
          typeof oldAttrs[key] === 'object'
        ) {
          hasUndefinedAttr = this.ensureUndefinedAttrs(
            newAttrs[key],
            oldAttrs[key],
          )
        }
      })
    }
    return hasUndefinedAttr
  }

  @disposable()
  dispose() {
    this.validator.dispose()
    this.clean()
    this.stopListening()
    this.off()
  }
}
