import type { KeyValue } from '../../common'
import type { Cell, ModelEventArgs } from '../../model'
import type { History } from '.'
import type { ValidatorEventArgs } from './validator'

export type HistoryModelEvents = keyof ModelEventArgs

export interface HistoryCommonOptions {
  enabled?: boolean
  ignoreAdd?: boolean
  ignoreRemove?: boolean
  ignoreChange?: boolean
  eventNames?: (keyof ModelEventArgs)[]
  /**
   * A function evaluated before any command is added. If the function
   * returns `false`, the command does not get stored. This way you can
   * control which commands do not get registered for undo/redo.
   */
  beforeAddCommand?: <T extends HistoryModelEvents>(
    this: History,
    event: T,
    args: ModelEventArgs[T],
  ) => any
  afterAddCommand?: <T extends HistoryModelEvents>(
    this: History,
    event: T,
    args: ModelEventArgs[T],
    cmd: HistoryCommand,
  ) => any
  executeCommand?: (
    this: History,
    cmd: HistoryCommand,
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

export interface HistoryOptions extends Partial<HistoryCommonOptions> {
  stackSize?: number
}

interface Data {
  id?: string
}

export interface HistoryCreationData extends Data {
  edge?: boolean
  node?: boolean
  props: Cell.Properties
}

export interface HistoryChangingData extends Data {
  key: string
  prev: KeyValue
  next: KeyValue
}

export interface HistoryCommand {
  batch: boolean
  modelChange?: boolean
  event?: HistoryModelEvents
  data: HistoryCreationData | HistoryChangingData
  options?: KeyValue
}

export type HistoryCommands = HistoryCommand[] | HistoryCommand

export interface HistoryArgs<T = never> {
  cmds: HistoryCommand[] | T
  options: KeyValue
}

export interface HistoryEventArgs extends ValidatorEventArgs {
  /**
   * Triggered when a command was undone.
   */
  undo: HistoryArgs
  /**
   * Triggered when a command were redone.
   */
  redo: HistoryArgs
  /**
   * Triggered when a command was canceled.
   */
  cancel: HistoryArgs
  /**
   * Triggered when command(s) were added to the stack.
   */
  add: HistoryArgs
  /**
   * Triggered when all commands were clean.
   */
  clean: HistoryArgs<null>
  /**
   * Triggered when any change was made to stacks.
   */
  change: HistoryArgs<null>
  /**
   * Triggered when a batch command received.
   */
  batch: { cmd: HistoryCommand; options: KeyValue }
}
