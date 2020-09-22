import { Context } from 'probot'
import { Util } from '../util'

export namespace Config {
  export interface Definition {
    /**
     * Only warn about insufficient information on these events type.
     * Valid values are 'issue' and 'pullRequest'.
     */
    on: {
      issue: boolean
      pullRequest: boolean
    }
    /**
     * Require Issues to contain more information than what is provided in the
     * issue templates. Will fail if the issue's body is equal to a provided
     * template.
     */
    checkIssueTemplate: boolean
    /**
     * Require Pull Requests to contain more information than what is provided
     * in the PR template. Will fail if the pull request's body is equal to the
     * provided template
     */
    checkPullRequestTemplate: boolean
    /**
     * Add a list of people whose Issues/PRs will not be commented on.
     */
    excludeUsers: string[]
    /**
     * Default issue titles to check against for lack of descriptiveness.
     */
    badIssueTitles: string[]
    /**
     * Default pull request titles to check against for lack of descriptiveness.
     */
    badPullRequestTitles: string[]
    /**
     * Label to be added to Issues and Pull Requests with insufficient information given.
     */
    labelToAdd?: string
    badIssueTitleComment: string | string[]
    badPullRequestTitleComment: string | string[]
    badIssueBodyComment: string | string[]
    badPullRequestBodyComment: string | string[]
    defaultComment: string | string[]
  }

  export const defaults: { requestInfo: Definition } = {
    requestInfo: {
      on: {
        issue: true,
        pullRequest: true,
      },
      checkIssueTemplate: true,
      checkPullRequestTemplate: true,
      excludeUsers: [],
      badIssueTitles: ['update', 'updates', 'test', 'issue', 'debug', 'demo'],
      badPullRequestTitles: ['update', 'updates', 'test'],
      labelToAdd: 'needs-more-info',
      badIssueTitleComment:
        'We would appreciate it if you could provide us with more info about this issue!',
      badPullRequestTitleComment:
        'We would appreciate it if you could provide us with more info about this pr!',
      badIssueBodyComment:
        'We would appreciate it if you could provide us with more info about this issue!',
      badPullRequestBodyComment:
        'We would appreciate it if you could provide us with more info about this pr!',
      defaultComment:
        'We would appreciate it if you could provide us with more info about this issue/pr!',
    },
  }
}

export namespace Config {
  export async function get(context: Context) {
    return Util.getConfig(context, defaults).then(
      (ret) => ret.requestInfo || defaults.requestInfo,
    )
  }
}
