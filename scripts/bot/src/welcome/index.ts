import { Application } from 'probot'
import { Core } from './core'

export namespace Welcome {
  export function start(app: Application) {
    Core.firstIssue(app)
    Core.firstPr(app)
    Core.firstMerge(app)
  }
}
