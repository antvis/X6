import { Application } from 'probot'
import { Core } from './core'

export namespace PRTriage {
  export function start(app: Application) {
    try {
      app.on(
        [
          'pull_request.opened',
          'pull_request.closed',
          'pull_request.edited',
          'pull_request.synchronize',
          'pull_request.reopened',
          'pull_request.ready_for_review',
          'pull_request_review.submitted',
          'pull_request_review.dismissed',
        ],
        Core.triage,
      )
    } catch (error) {
      app.log.error(error)
    }
  }
}
