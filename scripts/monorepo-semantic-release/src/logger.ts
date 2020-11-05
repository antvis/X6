import { Signale } from 'signale'

export namespace Logger {
  export function get({
    stdout,
    stderr,
  }: {
    stdout: NodeJS.WriteStream
    stderr: NodeJS.WriteStream
  }) {
    return new Signale({
      config: { displayTimestamp: true, displayLabel: false },
      scope: 'monorepo-semantic-release',
      stream: stdout,
      types: {
        error: { color: 'red', label: '', badge: '✖', stream: [stderr] },
        log: { color: 'magenta', label: '', badge: '•', stream: [stdout] },
        success: { color: 'green', label: '', badge: '✔', stream: [stdout] },
        complete: { color: 'green', label: '', badge: '🎉', stream: [stdout] },
      },
    })
  }
}
