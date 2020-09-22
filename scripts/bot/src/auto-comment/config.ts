import { Context } from 'probot'
import { Util } from '../util'

export namespace Config {
  export const defaults: {
    autoComment: { [event: string]: string | string[] }
  } = {
    autoComment: {},
  }

  export const eventTypes = {
    issues: [
      'assigned',
      'unassigned',
      'labeled',
      'unlabeled',
      'opened',
      'edited',
      'milestoned',
      'demilestoned',
      'closed',
      'reopened',
    ],
    pull_request: [
      'assigned',
      'unassigned',
      'review_requested',
      'review_request_removed',
      'labeled',
      'unlabeled',
      'opened',
      'edited',
      'closed',
      'reopened',
    ],
  }

  export async function get(context: Context) {
    return Util.getConfig(context, defaults).then(
      (ret) => ret.autoComment || defaults.autoComment,
    )
  }
}
