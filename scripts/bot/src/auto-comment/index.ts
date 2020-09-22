import { Application } from 'probot'
import { camelCase } from 'lodash'
import { Config } from './config'
import { Util } from '../util'

export namespace AutoComment {
  export function start(app: Application) {
    const events: string[] = []
    Object.keys(Config.eventTypes).forEach(
      (scope: 'issues' | 'pull_request') => {
        Config.eventTypes[scope].forEach((name) => {
          events.push(`${scope}.${name}`)
        })
      },
    )

    app.on(events as any, async (context) => {
      const payload = context.payload.issue || context.payload.pull_request
      const config = await Config.get(context)
      const eventName = camelCase(context.name)
      const template = config[eventName]

      if (template) {
        return context.github.issues.createComment(
          context.issue({
            body: Util.pickComment(template, { author: payload.user.login }),
          }),
        )
      }
    })
  }
}
