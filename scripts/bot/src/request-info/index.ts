import { Application } from 'probot'
import { Util } from '../util'
import { Config } from './config'
import { Core } from './core'

export namespace RequestInfo {
  export function start(app: Application) {
    app.on(['pull_request.opened', 'issues.opened'], async (context) => {
      let title: string
      let body: string
      let user

      let badBody: boolean = false
      let badTitle: boolean = false

      let eventType: 'issue' | 'pullRequest'
      if (context.payload.pull_request) {
        const pr = context.payload.pull_request
        user = pr.user
        title = pr.title
        body = pr.body
        eventType = 'pullRequest'
      } else {
        const issue = context.payload.issue
        user = issue.user
        title = issue.title
        body = issue.body
        eventType = 'issue'
      }

      try {
        const config = await Config.get(context)

        if (!config.on[eventType]) {
          return
        }

        let ignoreUser = false
        if (config.excludeUsers) {
          if (config.excludeUsers.includes(user.login)) {
            ignoreUser = true
          }
        }

        if (!ignoreUser) {
          if (config.badIssueTitles && eventType === 'issue') {
            if (config.badIssueTitles.includes(title.toLowerCase())) {
              badTitle = true
            }
          }

          if (config.badPullRequestTitles && eventType === 'pullRequest') {
            if (config.badPullRequestTitles.includes(title.toLowerCase())) {
              badTitle = true
            }
          }

          badBody = !body || !body.trim()

          if (!badBody) {
            if (eventType === 'pullRequest') {
              if (
                config.checkPullRequestTemplate &&
                !(await Core.isPullRequestBodyValid(context, body))
              ) {
                badBody = true
              }
            } else if (eventType === 'issue') {
              if (
                config.checkIssueTemplate &&
                !(await Core.isIssueBodyValid(context, body))
              ) {
                badBody = true
              }
            }
          }

          if (badTitle || badBody) {
            let comment: string | string[]
            if (badTitle) {
              comment =
                eventType === 'issue'
                  ? config.badIssueTitleComment || config.defaultComment
                  : config.badPullRequestTitleComment || config.defaultComment
            } else {
              comment =
                eventType === 'issue'
                  ? config.badIssueBodyComment || config.defaultComment
                  : config.badPullRequestBodyComment || config.defaultComment
            }

            context.github.issues.createComment(
              context.issue({ body: Util.pickComment(comment) }),
            )

            // Add label if there is one listed in the yaml file
            if (config.labelToAdd) {
              context.github.issues.addLabels(
                context.issue({ labels: [config.labelToAdd] }),
              )
            }
          }
        }
      } catch (err) {
        if (err.code !== 404) {
          throw err
        }
      }
    })
  }
}
