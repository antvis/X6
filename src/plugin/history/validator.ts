import { Basecoat, disposable } from '../../common'
import type { History } from '.'
import type { HistoryCommand, HistoryEventArgs } from './type'

export interface ValidatorOptions {
  history: History
  /**
   * To cancel (= undo + delete from redo stack) a command if is not valid.
   */
  cancelInvalid?: boolean
}

export type ValidatorCallback = (
  err: Error | null,
  cmd: HistoryCommand,
  next: (err: Error | null) => any,
) => any

export interface ValidatorEventArgs {
  invalid: { err: Error }
}

/**
 * Runs a set of callbacks to determine if a command is valid. This is
 * useful for checking if a certain action in your application does
 * lead to an invalid state of the graph.
 */
export class Validator extends Basecoat<ValidatorEventArgs> {
  protected readonly command: History

  protected readonly cancelInvalid: boolean

  protected readonly map: { [event: string]: ValidatorCallback[][] }

  constructor(options: ValidatorOptions) {
    super()
    this.map = {}
    this.command = options.history
    this.cancelInvalid = options.cancelInvalid !== false
    this.command.on('add', this.onCommandAdded, this)
  }

  protected onCommandAdded({ cmds }: HistoryEventArgs['add']) {
    return Array.isArray(cmds)
      ? cmds.every((cmd) => this.isValidCommand(cmd))
      : this.isValidCommand(cmds)
  }

  protected isValidCommand(cmd: HistoryCommand) {
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

  validate(events: string | string[], ...callbacks: ValidatorCallback[]) {
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

  @disposable()
  dispose() {
    this.command.off('add', this.onCommandAdded, this)
  }
}
