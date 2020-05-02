import { KeyValue } from '../../types'
import { ObjectExt } from '../../util'
import { Disablable } from '../../common'
import { Cell } from '../../core/cell'
import { Model } from '../../core/model'
import { Graph } from '../../core/graph'

export class UndoManager extends Disablable<UndoManager.EventArgs> {
  public readonly model: Model
  public readonly options: UndoManager.BaseOptions

  protected redoStack: UndoManager.Commands[]
  protected undoStack: UndoManager.Commands[]
  protected batchCommands: UndoManager.Command[] | null
  protected batchLevel: number
  protected lastBatchCmdIndex: number
  protected freezed: boolean = false
  protected readonly handlers: (<T extends UndoManager.ModelEvents>(
    event: T,
    args: Model.EventArgs[T],
  ) => any)[] = []

  constructor(options: UndoManager.Options) {
    super()
    this.model =
      options.model instanceof Model ? options.model : options.model.model
    this.options = Private.getOptions(options)
    this.clean()
    this.startListening()
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
   * redoStack. Canceled command therefore cannot be redo-ed.
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

  @Disablable.dispose()
  dispose() {
    this.clean()
    this.stopListening()
  }

  protected startListening() {
    this.model.on('batch:start', this.initBatchCommand, this)
    this.model.on('batch:stop', this.storeBatchCommand, this)
    this.options.eventNames.forEach((name, index) => {
      this.handlers[index] = this.addCommand.bind(this, name)
      this.model.on(name, this.handlers[index])
    })
  }

  protected stopListening() {
    this.model.off('batch:start', this.initBatchCommand, this)
    this.model.off('batch:stop', this.storeBatchCommand, this)
    this.options.eventNames.forEach((name, index) => {
      this.model.off(name, this.handlers[index])
    })
    this.handlers.length = 0
  }

  protected createCommand(options?: { batch: boolean }): UndoManager.Command {
    return {
      batch: options ? options.batch : false,
      data: {} as any,
    }
  }

  protected revertCommand(cmd: UndoManager.Commands, options?: KeyValue) {
    this.freezed = true

    const cmds = Array.isArray(cmd) ? Private.sortBatchCommands(cmd) : [cmd]
    for (let i = cmds.length - 1; i >= 0; i -= 1) {
      const cmd = cmds[i]
      const localOptions = {
        undoManager: this,
        ...options,
        ...ObjectExt.pick(cmd.options, this.options.revertOptionsList),
      }
      this.executeCommand(cmd, true, localOptions)
    }

    this.freezed = false
  }

  protected applyCommand(cmd: UndoManager.Commands, options?: KeyValue) {
    this.freezed = true

    const cmds = Array.isArray(cmd) ? Private.sortBatchCommands(cmd) : [cmd]
    for (let i = 0; i < cmds.length; i += 1) {
      const cmd = cmds[i]
      const localOptions = {
        undoManager: this,
        ...options,
        ...ObjectExt.pick(cmd.options, this.options.applyOptionsList),
      }
      this.executeCommand(cmd, false, localOptions)
    }

    this.freezed = false
  }

  protected executeCommand(
    cmd: UndoManager.Command,
    revert: boolean,
    options: KeyValue,
  ) {
    const model = this.model
    // const cell = cmd.modelChange ? model : model.getCell(cmd.data.id!)
    const cell = model.getCell(cmd.data.id!)
    const event = cmd.event

    if (
      (Private.isAddEvent(event) && revert) ||
      (Private.isRemoveEvent(event) && !revert)
    ) {
      cell.remove(options)
    } else if (
      (Private.isAddEvent(event) && !revert) ||
      (Private.isRemoveEvent(event) && revert)
    ) {
      const data = cmd.data as UndoManager.CreationData
      if (data.node) {
        model.addNode(data.props, options)
      } else if (data.edge) {
        model.addEdge(data.props, options)
      }
    } else if (Private.isChangeEvent(event)) {
      const data = cmd.data as UndoManager.ChangingData
      const key = data.key
      if (key) {
        const value = revert ? data.prev[key] : data.next[key]
        cell.prop(key, value, options)
      }
    } else {
      if (this.options.executeCommand) {
        this.options.executeCommand.call(this, cmd, options, false)
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
    if (options.dry) {
      return
    }

    if (
      (Private.isAddEvent(event) && this.options.ignoreAdd) ||
      (Private.isRemoveEvent(event) && this.options.ignoreRemove) ||
      (Private.isChangeEvent(event) && this.options.ignoreChange)
    ) {
      return
    }

    // before
    // ------
    const before = this.options.beforeAddCommand
    if (before != null && before.call(this, event, args) === false) {
      return
    }

    if (event === 'cell:change:*') {
      // tslint:disable-next-line
      event = `cell:change:${eventArgs.key}` as T
    }

    const cell = eventArgs.cell
    const isModelChange = cell instanceof Model
    let cmd: UndoManager.Command

    if (this.batchCommands) {
      // In most cases we are working with same object, doing
      // same action etc. translate an object piece by piece.
      cmd = this.batchCommands[Math.max(this.lastBatchCmdIndex, 0)]

      // Check if we are start working with new object or performing different
      // action with it. Note, that command is uninitialized when lastCmdIndex
      // equals -1. In that case we are done, command we were looking for is
      // already set

      const diffId =
        (isModelChange && !cmd.modelChange) || cmd.data.id !== cell.id
      const diffName = cmd.event !== event

      if (this.lastBatchCmdIndex >= 0 && (diffId || diffName)) {
        // Trying to find command first, which was performing same
        // action with the object as we are doing now with cell.
        const index = this.batchCommands.findIndex(
          cmd =>
            ((isModelChange && cmd.modelChange) || cmd.data.id === cell.id) &&
            cmd.event === event,
        )

        if (
          index < 0 ||
          Private.isAddEvent(event) ||
          Private.isRemoveEvent(event)
        ) {
          cmd = this.createCommand({ batch: true })
        } else {
          cmd = this.batchCommands[index]
          this.batchCommands.splice(index, 1)
        }
        this.batchCommands.push(cmd)
        this.lastBatchCmdIndex = this.batchCommands.length - 1
      }
    } else {
      cmd = this.createCommand({ batch: false })
    }

    // add & remove
    // -----------
    if (Private.isAddEvent(event) || Private.isRemoveEvent(event)) {
      const data = cmd.data as UndoManager.CreationData
      cmd.event = event
      cmd.options = options
      data.id = cell.id
      data.props = ObjectExt.merge({}, cell.toJSON())
      if (cell.isEdge()) {
        data.edge = true
      } else if (cell.isNode()) {
        data.node = true
      }

      return this.push(cmd, options)
    }

    // change:*
    // --------
    if (Private.isChangeEvent(event)) {
      const key = (args as Model.EventArgs['cell:change:*']).key
      const data = cmd.data as UndoManager.ChangingData

      if (!cmd.batch || !cmd.event) {
        // Do this only once. Set previous data and action (also
        // serves as a flag so that we don't repeat this branche).
        cmd.event = event
        cmd.options = options
        data.key = key
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
    if (this.options.addCommand) {
      this.options.addCommand.call(this, event, args, cmd)
    }
    this.push(cmd, options)
  }

  /**
   * Function `initBatchCommand()` gives you the ability to gather multiple
   * changes into a single command. These commands could be revert with
   * single `undo()` call. From the moment the function is called every
   * change made on model is not stored into the undoStack. Changes are
   * temporarily kept until `storeBatchCommand()` is called.
   */
  protected initBatchCommand() {
    if (this.batchCommands) {
      this.batchLevel += 1
    } else {
      this.batchCommands = [this.createCommand({ batch: true })]
      this.batchLevel = 0
      this.lastBatchCmdIndex = -1
    }
  }

  /**
   * Calling function `storeBatchCommand()` tells the UndoManager to
   * store all changes temporarily kept in the undoStack. In order to
   * store changes you have to call this function as many times as
   * `initBatchCommand()` had been called.
   */
  protected storeBatchCommand(options: KeyValue) {
    if (this.batchCommands && this.batchLevel <= 0) {
      const cmds = this.filterBatchCommand(this.batchCommands)
      if (0 < cmds.length) {
        this.redoStack = []
        this.undoStack.push(cmds)
        this.notify('add', cmds, options)
      }
      this.batchCommands = null
      this.lastBatchCmdIndex = -1
      this.batchLevel = 0
    } else {
      if (this.batchCommands && this.batchLevel > 0) {
        this.batchLevel -= 1
      }
    }
  }

  protected filterBatchCommand(batchCommands: UndoManager.Command[]) {
    let cmds = batchCommands.slice()
    const result = []

    while (0 < cmds.length) {
      const cmd = cmds.shift()!
      const evt = cmd.event
      const id = cmd.data.id

      if (null != evt && (null != id || cmd.modelChange)) {
        if (Private.isAddEvent(evt)) {
          const index = cmds.findIndex(
            c => Private.isRemoveEvent(c.event) && c.data.id === id,
          )

          if (index >= 0) {
            cmds = cmds.filter((c, i) => index < i || c.data.id !== id)
            continue
          }
        } else if (Private.isRemoveEvent(evt)) {
          const index = cmds.findIndex(
            c => Private.isAddEvent(c.event) && c.data.id === id,
          )
          if (index >= 0) {
            cmds.splice(index, 1)
            continue
          }
        } else if (Private.isChangeEvent(evt)) {
          const data = cmd.data as UndoManager.ChangingData

          if (ObjectExt.isEqual(data.prev, data.next)) {
            continue
          }
        } else {
        }

        result.push(cmd)
      }
    }

    return result
  }

  protected notify(
    event: keyof UndoManager.EventArgs,
    cmd: UndoManager.Commands | null,
    options: KeyValue,
  ) {
    const cmds = cmd == null ? null : Array.isArray(cmd) ? cmd : [cmd]
    this.emit(event, { cmds, options })
    this.emit('change', { cmds, options })
  }

  protected push(cmd: UndoManager.Command, options: KeyValue) {
    this.redoStack = []
    if (cmd.batch) {
      this.lastBatchCmdIndex = Math.max(this.lastBatchCmdIndex, 0)
      this.emit('batch', { cmd, options })
    } else {
      this.undoStack.push(cmd)
      this.notify('add', cmd, options)
    }
  }
}

export namespace UndoManager {
  export type ModelEvents = keyof Model.EventArgs
  export interface BaseOptions {
    ignoreAdd?: boolean
    ignoreRemove?: boolean
    ignoreChange?: boolean
    eventNames: (keyof Model.EventArgs)[]
    /**
     * A function evaluated before any command is added. If the function
     * returns `false`, the command does not get stored. This way you can
     * control which commands do not get registered for undo/redo.
     */
    beforeAddCommand?: <T extends ModelEvents>(
      this: UndoManager,
      event: T,
      args: Model.EventArgs[T],
    ) => any
    addCommand?: <T extends ModelEvents>(
      this: UndoManager,
      event: T,
      args: Model.EventArgs[T],
      cmd: Command,
    ) => any
    executeCommand?: (
      this: UndoManager,
      cmd: Command,
      revert: boolean,
      options: KeyValue,
    ) => any
    /**
     * An array of options property names that passed in undo actions.
     */
    revertOptionsList: string[]
    /**
     * An array of options property names that passed in redo actions.
     */
    applyOptionsList: string[]
  }

  export interface Options extends Partial<BaseOptions> {
    model: Model | Graph
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

  export type Commands = UndoManager.Command[] | UndoManager.Command
}

export namespace UndoManager {
  interface Args<T = never> {
    cmds: Command[] | T
    options: KeyValue
  }
  export interface EventArgs {
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

export namespace Private {
  export function isAddEvent(event?: UndoManager.ModelEvents) {
    return event === 'cell:added'
  }

  export function isRemoveEvent(event?: UndoManager.ModelEvents) {
    return event === 'cell:removed'
  }

  export function isChangeEvent(event?: UndoManager.ModelEvents) {
    return event != null && event.startsWith('cell:change:')
  }

  export function getOptions(
    options: UndoManager.Options,
  ): UndoManager.BaseOptions {
    const { model, ...others } = options
    const reservedNames: UndoManager.ModelEvents[] = [
      'cell:added',
      'cell:removed',
      'cell:change:*',
    ]

    const batchEvents: UndoManager.ModelEvents[] = ['batch:start', 'batch:stop']

    const eventNames = options.eventNames
      ? options.eventNames.filter(
          event =>
            !(
              Private.isChangeEvent(event) ||
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

  export function sortBatchCommands(cmds: UndoManager.Command[]) {
    const results: UndoManager.Command[] = []
    for (let i = 0, ii = cmds.length; i < ii; i += 1) {
      const cmd = cmds[i]
      let index: number | null = null

      if (Private.isAddEvent(cmd.event)) {
        const id = cmd.data.id
        for (let j = 0; j < i; j += 1) {
          if (cmds[j].data.id === id) {
            index = j
            break
          }
        }
      }

      if (null !== index) {
        results.splice(index, 0, cmd)
      } else {
        results.push(cmd)
      }
    }
    return results
  }
}
