import { Application } from 'probot'
import { Config } from './config'
import { hasSkipKeywords, chooseReviewers, chooseAssignees } from './util'

export namespace AutoAssign {
  export function start(app: Application) {
    app.on(
      ['pull_request.opened', 'pull_request.ready_for_review'],
      async (context) => {
        if (context.payload.pull_request.draft) {
          context.log('ignore draft PR')
          return
        }

        const config = await Config.get(context)
        const {
          skipKeywords,
          useReviewGroups,
          reviewGroups,
          useAssigneeGroups,
          assigneeGroups,
          addReviewers,
          addAssignees,
        } = config

        if (useReviewGroups && !reviewGroups) {
          throw new Error(
            "Error in configuration file to do with using review groups. Expected 'reviewGroups' variable to be set because the variable 'useReviewGroups' = true.",
          )
        }

        if (useAssigneeGroups && !assigneeGroups) {
          throw new Error(
            "Error in configuration file to do with using review groups. Expected 'assigneeGroups' variable to be set because the variable 'useAssigneeGroups' = true.",
          )
        }

        const title = context.payload.pull_request.title
        const owner = context.payload.pull_request.user.login

        if (skipKeywords && hasSkipKeywords(title, skipKeywords)) {
          context.log('skips adding reviewers')
          return
        }

        if (addReviewers) {
          try {
            const { reviewers, team_reviewers } = chooseReviewers(owner, config)
            if (reviewers.length > 0 || team_reviewers.length > 0) {
              const params = context.pullRequest({ reviewers, team_reviewers })
              const result = await context.github.pulls.requestReviewers(params)
              context.log(result)
            }
          } catch (error) {
            context.log(error)
          }
        }

        if (addAssignees) {
          try {
            const assignees = chooseAssignees(owner, config)
            if (assignees.length > 0) {
              const result = await context.github.issues.addAssignees(
                context.issue({ assignees }),
              )
              context.log(result)
            }
          } catch (error) {
            context.log(error)
          }
        }
      },
    )
  }
}
