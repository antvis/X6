import { Application } from 'probot'
import { Config } from './config'
import { Util } from '../util'

export namespace Core {
  export function firstIssue(app: Application) {
    app.on('issues.opened', async (context) => {
      const response = await context.github.issues.listForRepo(
        context.repo({
          state: 'all',
          creator: context.payload.issue.user.login,
        }),
      )

      const countIssue = response.data.filter((data) => !data.pull_request)
      if (countIssue.length === 1) {
        try {
          const config = await Config.get(context)
          const comment = config.firstIssueComment
          if (comment) {
            context.github.issues.createComment(
              context.issue({ body: Util.pickComment(comment) }),
            )
          }
        } catch (err) {
          if (err.code !== 404) {
            throw err
          }
        }
      }
    })
  }

  export function firstPr(app: Application) {
    app.on('pull_request.opened', async (context) => {
      // Get all issues for repo with user as creator
      const response = await context.github.issues.listForRepo(
        context.repo({
          state: 'all',
          creator: context.payload.pull_request.user.login,
        }),
      )

      const countPR = response.data.filter((data) => data.pull_request)
      if (countPR.length === 1) {
        try {
          const config = await Config.get(context)
          const comment = config.firstPRComment
          if (comment) {
            context.github.issues.createComment(
              context.issue({ body: Util.pickComment(comment) }),
            )
          }
        } catch (error) {
          if (error.code !== 404) {
            throw error
          }
        }
      }
    })
  }

  export function firstMerge(app: Application) {
    app.on('pull_request.closed', async (context) => {
      if (context.payload.pull_request.merged) {
        const creator = context.payload.pull_request.user.login
        const { owner, repo } = context.repo()
        const res = await context.github.search.issuesAndPullRequests({
          q: `is:pr is:merged author:${creator} repo:${owner}/${repo}`,
        })

        const mergedPRs = res.data.items.filter(
          (pr) => pr.number !== context.payload.pull_request.number,
        )

        if (mergedPRs.length === 0) {
          try {
            const config = await Config.get(context)
            const comment = config.firstPRMergeComment
            if (comment) {
              context.github.issues.createComment(
                context.issue({ body: Util.pickComment(comment) }),
              )
            }
          } catch (err) {
            if (err.code !== 404) {
              throw err
            }
          }
        }
      }
    })
  }
}
