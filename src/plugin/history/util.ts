import type {
  HistoryCommand,
  HistoryCommonOptions,
  HistoryModelEvents,
  HistoryOptions,
} from './type'

export function isAddEvent(event?: HistoryModelEvents) {
  return event === 'cell:added'
}

export function isRemoveEvent(event?: HistoryModelEvents) {
  return event === 'cell:removed'
}

export function isChangeEvent(event?: HistoryModelEvents) {
  return event != null && event.startsWith('cell:change:')
}

export function getOptions(options: HistoryOptions): HistoryCommonOptions {
  const reservedNames: HistoryModelEvents[] = [
    'cell:added',
    'cell:removed',
    'cell:change:*',
  ]

  const batchEvents: HistoryModelEvents[] = ['batch:start', 'batch:stop']

  const eventNames = options.eventNames
    ? options.eventNames.filter(
        (event) =>
          !(
            isChangeEvent(event) ||
            reservedNames.includes(event) ||
            batchEvents.includes(event)
          ),
      )
    : reservedNames

  return {
    enabled: true,
    ...options,
    eventNames,
    applyOptionsList: options.applyOptionsList || ['propertyPath'],
    revertOptionsList: options.revertOptionsList || ['propertyPath'],
  }
}

export function sortBatchCommands(cmds: HistoryCommand[]) {
  const results: HistoryCommand[] = []
  for (let i = 0, ii = cmds.length; i < ii; i += 1) {
    const cmd = cmds[i]
    let index: number | null = null

    if (isAddEvent(cmd.event)) {
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
