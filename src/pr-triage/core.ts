import { Context } from 'probot'
import { Config } from './config'

export namespace Core {
  export async function triage(context: Context) {
    ensureLabels(context)

    const state = await getState(context)
    if (state) {
      updateLabel(context, state)
    } else {
      throw new Error('Undefined state')
    }
  }

  function getPullRequest(context: Context) {
    return context.payload.pull_request || context.payload.review.pull_request
  }

  async function getState(context: Context): Promise<Config.State> {
    const pr = getPullRequest(context)

    if (pr.draft) {
      return 'draft'
    }

    if (pr.title.match(Config.defaults.wipRegex)) {
      return 'wip'
    }

    if (pr.state === 'closed' && pr.merged) {
      return 'merged'
    }

    const reviews = await getUniqueReviews(context)
    const requiredNumberOfReviews = await getRequiredNumberOfReviews(context)
    const numRequestedReviewsRemaining = await getRequestedNumberOfReviews(
      context,
    )

    if (reviews.length === 0) {
      return 'unreviewed'
    }

    const changeRequestedReviews = reviews.filter(
      (review) => review.state === 'CHANGES_REQUESTED',
    )
    const approvedReviews = reviews.filter(
      (review) => review.state === 'APPROVED',
    )

    if (changeRequestedReviews.length > 0) {
      return 'changesRequested'
    }

    if (
      approvedReviews.length < requiredNumberOfReviews ||
      numRequestedReviewsRemaining > 0
    ) {
      // Mark if partially approved if:
      // 1) Branch protections require more approvals
      //  - or -
      // 2) not everyone requested has approved (requested remaining > 0)
      return 'partiallyApproved'
    }

    if (reviews.length === approvedReviews.length) {
      return 'approved'
    }
  }

  async function getReviews(context: Context) {
    const pr = getPullRequest(context)
    // Ignore inconsitent variable name conversation
    // because of https://octokit.github.io/rest.js/v17#pulls-list-reviews
    return context.github.pulls
      .listReviews(context.repo({ pull_number: pr.number }))
      .then((res) => res.data || [])
  }

  async function getUniqueReviews(context: Context) {
    const pr = getPullRequest(context)
    const sha = pr.head.sha
    const reviews = await getReviews(context)
    const uniqueReviews = reviews
      .filter((review) => review.commit_id === sha)
      .filter(
        (review) =>
          review.state === 'APPROVED' || review.state === 'CHANGES_REQUESTED',
      )
      .reduce<{ [id: number]: { state: string; submitted_at: string } }>(
        (memo, review) => {
          if (memo[review.user.id] == null) {
            memo[review.user.id] = {
              state: review.state,
              submitted_at: review.submitted_at,
            }
          } else {
            const a = new Date(memo[review.user.id]['submitted_at']).getTime()
            const b = new Date(review.submitted_at).getTime()
            if (a < b) {
              memo[review.user.id] = {
                state: review.state,
                submitted_at: review.submitted_at,
              }
            }
          }
          return memo
        },
        {},
      )

    return Object.values(uniqueReviews)
  }

  /**
   * Get the required number of reviews according to branch protections
   * @return {Promise<number>} The number of required approving reviews,
   * or `1` if Administration Permission is not granted or Branch Protection
   * is not set up.
   */
  async function getRequiredNumberOfReviews(context: Context): Promise<number> {
    const pr = getPullRequest(context)
    const branch = pr.base.ref
    return await context.github.repos
      // See: https://developer.github.com/v3/previews/#require-multiple-approving-reviews
      .getBranchProtection(
        context.repo({
          branch,
          mediaType: {
            previews: ['luke-cage'],
          },
        }),
      )
      .then((res) => {
        // If the Branch protection rule is configure but the Requrie pull request review before mergning is not set
        // it does not have `required_pull_request_reviews` property
        if (!res.data.hasOwnProperty('required_pull_request_reviews')) {
          throw new Error('Required reviews not configured error')
        }

        return (
          res.data.required_pull_request_reviews
            .required_approving_review_count || 1
        )
      })
      .catch((err) => {
        // Return the minium number of reviews if it's 403 or 403 because Administration Permission is not granted (403) or Branch Protection is not set up(404)
        if (
          err.status === 404 ||
          err.status === 403 ||
          err.message === 'Required reviews not configured error'
        ) {
          return 1
        }
        throw err
      })
  }

  /**
   * Get the number of users and teams that have been requested to review the PR
   */
  async function getRequestedNumberOfReviews(context: Context) {
    const pr = getPullRequest(context)
    return context.github.pulls
      .listRequestedReviewers(context.repo({ pull_number: pr.number }))
      .then((res) => res.data.teams.length + res.data.users.length)
  }

  async function ensureLabels(context: Context) {
    const labels = Object.values(Config.defaults.labels)
    for (let i = 0, l = labels.length; i < l; i += 1) {
      const { name, color } = labels[i]
      await context.github.issues.getLabel(context.repo({ name })).catch(() =>
        context.github.issues.createLabel(
          context.repo({
            name,
            color,
          }),
        ),
      )
    }
  }

  async function updateLabel(context: Context, currentState: Config.State) {
    const previousState = getPreviousState(context)
    if (previousState) {
      if (currentState === 'wip') {
        await removeLabelByState(context, previousState as Config.Label)
      } else if (previousState !== currentState) {
        await removeLabelByState(context, previousState as Config.Label)
        await addLabelByState(context, currentState as Config.Label)
      }
    } else {
      if (currentState !== 'wip') {
        await addLabelByState(context, currentState as Config.Label)
      }
    }
  }

  function getPreviousState(context: Context): Config.Label | undefined {
    const presets = Config.defaults.labels
    const states = Object.keys(presets).reduce<{ [label: string]: string }>(
      (memo, state: Config.Label) => {
        memo[presets[state].name] = state
        return memo
      },
      {},
    )

    return getPullRequest(context)
      .labels.map((label: any) => {
        return label.name && states[label.name]
      })
      .filter((key: string) => key != null)[0]
  }

  async function removeLabelByState(context: Context, state: Config.Label) {
    return getLabelByState(context, state).then(
      (preset) => {
        if (preset) {
          const pr = getPullRequest(context)
          return context.github.issues.removeLabel(
            context.repo({
              issue_number: pr.number,
              name: preset.name,
            }),
          )
        }
      },
      () => {}, // Do nothing for error handling.
    )
  }

  async function addLabelByState(context: Context, state: Config.Label) {
    return getLabelByState(context, state).catch(() => {
      const pr = getPullRequest(context)
      const preset = Config.defaults.labels[state]
      return context.github.issues.addLabels(
        context.repo({
          issue_number: pr.number,
          labels: [preset.name],
        }),
      )
    })
  }

  async function getLabelByState(
    context: Context,
    state: Config.Label,
  ): Promise<{ name: string; color: string }> {
    return new Promise((resolve, reject) => {
      const labels = getPullRequest(context).labels
      const preset = Config.defaults.labels[state]
      for (const label of labels) {
        if ((label.name = preset.name)) {
          resolve(preset)
        }
      }
      reject()
    })
  }
}
