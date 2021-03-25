import { Application } from 'probot'
import { Core } from './core'

export namespace WIP {
  export function start(app: Application) {
    try {
      app.on(
        [
          'pull_request.opened',
          'pull_request.edited',
          'pull_request.labeled',
          'pull_request.unlabeled',
          'pull_request.synchronize',
        ],
        Core.start,
      )
    } catch (error) {
      app.log.error(error)
    }
  }
}
