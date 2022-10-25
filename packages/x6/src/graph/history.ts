import { KeyValue } from '../types'
import { ObjectExt, FunctionExt } from '../util'
import { Basecoat, IDisablable } from '../common'
import { Cell } from '../model/cell'
import { Model } from '../model/model'
import { Graph } from './graph'

export class HistoryManager
  extends Basecoat<HistoryManager.EventArgs>
  implements IDisablable
{
  public readonly model: Model
  public readonly graph: Graph
  public readonly options: HistoryManager.CommonOptions
  public readonly validator: HistoryManager.Validator
  protected redoStack: HistoryManager.Commands[]
  protected undoStack: HistoryManager.Commands[]
  protected batchCommands: HistoryManager.Command[] | null = null
  protected batchLevel = 0
  protected lastBatchIndex = -1
  protected freezed = false

  protected readonly handlers: (<T extends HistoryManager.ModelEvents>(
    event: T,
    args: Model.EventArgs[T],
  ) => any)[] = []

  constructor(options: HistoryManager.Options) {
    super()
    this.graph = options.graph
    this.model = options.graph.model
    this.options = Util.getOptions(options)
    this.validator = new HistoryManager.Validator({
      history: this,
      cancelInvalid: this.options.cancelInvalid,
    })
    this.clean()
    this.startListening()
  }

  get disabled() {
    return this.options.enabled !== true
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
        this.undoStack.push(cmd)
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

  clean(options: KeyValue = {}) {
    this.undoStack = []
    this.redoStack = []
    this.notify('clean', null, options)
    return this
  }

  canUndo() {
    return !this.disabled && this.undoStack.length > 0
  }

  canRedo() {
    return !this.disabled && this.redoStack.length > 0
  }

  validate(
    events: string | string[],
    ...callbacks: HistoryManager.Validator.Callback[]
  ) {
    this.validator.validate(events, ...callbacks)
    return this
  }

  @Basecoat.dispose()
  dispose() {
    this.validator.dispose()
    this.clean()
    this.stopListening()
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

  protected createCommand(options?: {
    batch: boolean
  }): HistoryManager.Command {
    return {
      batch: options ? options.batch : false,
      data: {} as HistoryManager.CreationData,
    }
  }

  protected revertCommand(cmd: HistoryManager.Commands, options?: KeyValue) {
    this.freezed = true

    const cmds = Array.isArray(cmd) ? Util.sortBatchCommands(cmd) : [cmd]
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

  protected applyCommand(cmd: HistoryManager.Commands, options?: KeyValue) {
    this.freezed = true

    const cmds = Array.isArray(cmd) ? Util.sortBatchCommands(cmd) : [cmd]
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
    cmd: HistoryManager.Command,
    revert: boolean,
    options: KeyValue,
  ) {
    const model = this.model
    // const cell = cmd.modelChange ? model : model.getCell(cmd.data.id!)
    const cell = model.getCell(cmd.data.id!)
    const event = cmd.event

    if (
      (Util.isAddEvent(event) && revert) ||
      (Util.isRemoveEvent(event) && !revert)
    ) {
      cell && cell.remove(options)
    } else if (
      (Util.isAddEvent(event) && !revert) ||
      (Util.isRemoveEvent(event) && revert)
    ) {
      const data = cmd.data as HistoryManager.CreationData
      if (data.node) {
        model.addNode(data.props, options)
      } else if (data.edge) {
        model.addEdge(data.props, options)
      }
    } else if (Util.isChangeEvent(event)) {
      const data = cmd.data as HistoryManager.ChangingData
      const key = data.key
      if (key && cell) {
        const value = revert ? data.prev[key] : data.next[key]
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
      (Util.isAddEvent(event) && this.options.ignoreAdd) ||
      (Util.isRemoveEvent(event) && this.options.ignoreRemove) ||
      (Util.isChangeEvent(event) && this.options.ignoreChange)
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
    let cmd: HistoryManager.Command

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

        if (index < 0 || Util.isAddEvent(event) || Util.isRemoveEvent(event)) {
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
    if (Util.isAddEvent(event) || Util.isRemoveEvent(event)) {
      const data = cmd.data as HistoryManager.CreationData
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
    if (Util.isChangeEvent(event)) {
      const key = (args as Model.EventArgs['cell:change:*']).key
      const data = cmd.data as HistoryManager.ChangingData

      if (!cmd.batch || !cmd.event) {
        // Do this only once. Set previous data and action (also
        // serves as a flag so that we don't repeat this branche).
        cmd.event = event
        cmd.options = options
        data.key = key as string
        if (data.prev == null) {
          data.prev = {}
        }
        data.prev[key] = ObjectExt.clone(cell.previous(key))

        if (isModelChange) {
          cmd.modelChange = true
        } else {
          data.id = cell.id
        }
      }

      if (data.next == null) {
        data.next = {}
      }
      data.next[key] = ObjectExt.clone(cell.prop(key))
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
        this.undoStack.push(cmds)
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

  protected filterBatchCommand(batchCommands: HistoryManager.Command[]) {
    let cmds = batchCommands.slice()
    const result = []

    while (cmds.length > 0) {
      const cmd = cmds.shift()!
      const evt = cmd.event
      const id = cmd.data.id

      if (evt != null && (id != null || cmd.modelChange)) {
        if (Util.isAddEvent(evt)) {
          const index = cmds.findIndex(
            (c) => Util.isRemoveEvent(c.event) && c.data.id === id,
          )

          if (index >= 0) {
            cmds = cmds.filter((c, i) => index < i || c.data.id !== id)
            continue
          }
        } else if (Util.isRemoveEvent(evt)) {
          const index = cmds.findIndex(
            (c) => Util.isAddEvent(c.event) && c.data.id === id,
          )
          if (index >= 0) {
            cmds.splice(index, 1)
            continue
          }
        } else if (Util.isChangeEvent(evt)) {
          const data = cmd.data as HistoryManager.ChangingData

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
    event: keyof HistoryManager.EventArgs,
    cmd: HistoryManager.Commands | null,
    options: KeyValue,
  ) {
    const cmds = cmd == null ? null : Array.isArray(cmd) ? cmd : [cmd]
    this.emit(event, { cmds, options })
    this.emit('change', { cmds, options })
  }

  protected push(cmd: HistoryManager.Command, options: KeyValue) {
    this.redoStack = []
    if (cmd.batch) {
      this.lastBatchIndex = Math.max(this.lastBatchIndex, 0)
      this.emit('batch', { cmd, options })
    } else {
      this.undoStack.push(cmd)
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
  private consolidateCommands() {
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
}

export namespace HistoryManager {
  export type ModelEvents = keyof Model.EventArgs

  export interface CommonOptions {
    enabled?: boolean
    ignoreAdd?: boolean
    ignoreRemove?: boolean
    ignoreChange?: boolean
    eventNames?: (keyof Model.EventArgs)[]
    /**
     * A function evaluated before any command is added. If the function
     * returns `false`, the command does not get stored. This way you can
     * control which commands do not get registered for undo/redo.
     */
    beforeAddCommand?: <T extends ModelEvents>(
      this: HistoryManager,
      event: T,
      args: Model.EventArgs[T],
    ) => any
    afterAddCommand?: <T extends ModelEvents>(
      this: HistoryManager,
      event: T,
      args: Model.EventArgs[T],
      cmd: Command,
    ) => any
    executeCommand?: (
      this: HistoryManager,
      cmd: Command,
      revert: boolean,
      options: KeyValue,
    ) => any
    /**
     * An array of options property names that passed in undo actions.
     */
    revertOptionsList?: string[]
    /**
     * An array of options property names that passed in redo actions.
     */
    applyOptionsList?: string[]
    /**
     * Determine whether to cancel an invalid command or not.
     */
    cancelInvalid?: boolean
  }

  export interface Options extends Partial<CommonOptions> {
    graph: Graph
  }

  interface Data {
    id?: string
  }

  export interface CreationData extends Data {
    edge?: boolean
    node?: boolean
    props: Cell.Properties
  }

  export interface ChangingData extends Data {
    key: string
    prev: KeyValue
    next: KeyValue
  }

  export interface Command {
    batch: boolean
    modelChange?: boolean
    event?: ModelEvents
    data: CreationData | ChangingData
    options?: KeyValue
  }

  export type Commands = HistoryManager.Command[] | HistoryManager.Command
}

export namespace HistoryManager {
  interface Args<T = never> {
    cmds: Command[] | T
    options: KeyValue
  }

  export interface EventArgs extends Validator.EventArgs {
    /**
     * Triggered when a command was undone.
     */
    undo: Args
    /**
     * Triggered when a command were redone.
     */
    redo: Args
    /**
     * Triggered when a command was canceled.
     */
    cancel: Args
    /**
     * Triggered when command(s) were added to the stack.
     */
    add: Args
    /**
     * Triggered when all commands were clean.
     */
    clean: Args<null>
    /**
     * Triggered when any change was made to stacks.
     */
    change: Args<null>
    /**
     * Triggered when a batch command received.
     */
    batch: { cmd: Command; options: KeyValue }
  }
}

export namespace HistoryManager {
  /**
   * Runs a set of callbacks to determine if a command is valid. This is
   * useful for checking if a certain action in your application does
   * lead to an invalid state of the graph.
   */
  export class Validator extends Basecoat<Validator.EventArgs> {
    protected readonly command: HistoryManager

    protected readonly cancelInvalid: boolean

    protected readonly map: { [event: string]: Validator.Callback[][] }

    constructor(options: Validator.Options) {
      super()
      this.map = {}
      this.command = options.history
      this.cancelInvalid = options.cancelInvalid !== false
      this.command.on('add', this.onCommandAdded, this)
    }

    protected onCommandAdded({ cmds }: HistoryManager.EventArgs['add']) {
      return Array.isArray(cmds)
        ? cmds.every((cmd) => this.isValidCommand(cmd))
        : this.isValidCommand(cmds)
    }

    protected isValidCommand(cmd: HistoryManager.Command) {
      if (cmd.options && cmd.options.validation === false) {
        return true
      }

      const callbacks = (cmd.event && this.map[cmd.event]) || []

      let handoverErr: Error | null = null

      callbacks.forEach((routes) => {
        let i = 0

        const rollup = (err: Error | null) => {
          const fn = routes[i]
          i += 1

          try {
            if (fn) {
              fn(err, cmd, rollup)
            } else {
              handoverErr = err
              return
            }
          } catch (err) {
            rollup(err)
          }
        }

        rollup(handoverErr)
      })

      if (handoverErr) {
        if (this.cancelInvalid) {
          this.command.cancel()
        }
        this.emit('invalid', { err: handoverErr })
        return false
      }

      return true
    }

    validate(events: string | string[], ...callbacks: Validator.Callback[]) {
      const evts = Array.isArray(events) ? events : events.split(/\s+/)

      callbacks.forEach((callback) => {
        if (typeof callback !== 'function') {
          throw new Error(`${evts.join(' ')} requires callback functions.`)
        }
      })

      evts.forEach((event) => {
        if (this.map[event] == null) {
          this.map[event] = []
        }
        this.map[event].push(callbacks)
      })

      return this
    }

    @Basecoat.dispose()
    dispose() {
      this.command.off('add', this.onCommandAdded, this)
    }
  }

  export namespace Validator {
    export interface Options {
      history: HistoryManager
      /**
       * To cancel (= undo + delete from redo stack) a command if is not valid.
       */
      cancelInvalid?: boolean
    }

    export type Callback = (
      err: Error | null,
      cmd: HistoryManager.Command,
      next: (err: Error | null) => any,
    ) => any

    export interface EventArgs {
      invalid: { err: Error }
    }
  }
}

namespace Util {
  export function isAddEvent(event?: HistoryManager.ModelEvents) {
    return event === 'cell:added'
  }

  export function isRemoveEvent(event?: HistoryManager.ModelEvents) {
    return event === 'cell:removed'
  }

  export function isChangeEvent(event?: HistoryManager.ModelEvents) {
    return event != null && event.startsWith('cell:change:')
  }

  export function getOptions(
    options: HistoryManager.Options,
  ): HistoryManager.CommonOptions {
    const { graph, ...others } = options
    const reservedNames: HistoryManager.ModelEvents[] = [
      'cell:added',
      'cell:removed',
      'cell:change:*',
    ]

    const batchEvents: HistoryManager.ModelEvents[] = [
      'batch:start',
      'batch:stop',
    ]

    const eventNames = options.eventNames
      ? options.eventNames.filter(
          (event) =>
            !(
              Util.isChangeEvent(event) ||
              reservedNames.includes(event) ||
              batchEvents.includes(event)
            ),
        )
      : reservedNames

    return {
      ...others,
      eventNames,
      applyOptionsList: options.applyOptionsList || ['propertyPath'],
      revertOptionsList: options.revertOptionsList || ['propertyPath'],
    }
  }

  export function sortBatchCommands(cmds: HistoryManager.Command[]) {
    const results: HistoryManager.Command[] = []
    for (let i = 0, ii = cmds.length; i < ii; i += 1) {
      const cmd = cmds[i]
      let index: number | null = null

      if (Util.isAddEvent(cmd.event)) {
        const id = cmd.data.id
        for (let j = 0; j < i; j += 1) {
          if (cmds[j].data.id === id) {
            index = j
            break
          }
        }
      }

      if (index !== null) {
        results.splice(index, 0, cmd)
      } else {
        results.push(cmd)
      }
    }
    return results
  }
}
