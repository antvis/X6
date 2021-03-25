import { Context } from 'probot'
import { Status } from './status'

export namespace Core {
  export async function start(context: Context) {
    try {
      const nextState = await Status.get(context)
      context.log(`[wip] Next status: ${JSON.stringify(nextState)}`)
      const hasChange = await Status.hasChange(context, nextState)
      context.log(`[wip] Status changed: ${hasChange}`)

      if (hasChange) {
        await Status.update(context, nextState)
        context.log(
          nextState.wip ? '[wip] work in progress' : '[wip] ready for review',
        )
      } else {
        context.log('[wip] status not changed')
      }
    } catch (error) {
      context.log(`[wip] ${error.message}`)
    }
  }
}
