import { Application } from 'probot'
import { Util } from '../util'
import { Config } from './config'

export namespace LabelActions {
  export function start(app: Application) {
    app.on(
      [
        'issues.labeled',
        'issues.unlabeled',
        'pull_request.labeled',
        'pull_request.unlabeled',
      ],
      async (context) => {
        const config = await Config.get(context)
        const { payload, github } = context
        const only = config.only
        const type = payload.issue ? 'issues' : 'pulls'
        if (only && only !== type) {
          return
        }

        let label = payload.label.name
        if (payload.action === 'unlabeled') {
          label = `-${label}`
        }

        const actions = Config.getActions(config, type, label)
        const { comment, open, close, lock, unlock, lockReason } = actions
        const targetPayload = payload.issue || payload.pull_request

        if (comment) {
          const body = Util.pickComment(comment, {
            author: targetPayload.user.login,
          })
          await Util.ensureUnlock(context, () =>
            github.issues.createComment(context.issue({ body })),
          )
        }

        if (open && targetPayload.state === 'closed') {
          await github.issues.update(context.issue({ state: 'open' }))
        }

        if (close && targetPayload.state === 'open') {
          await github.issues.update(context.issue({ state: 'closed' }))
        }

        if (lock && !targetPayload.locked) {
          await Util.lockIssue(context, lockReason)
        }

        if (unlock && targetPayload.locked) {
          await github.issues.unlock(context.issue())
        }
      },
    )
  }
}
