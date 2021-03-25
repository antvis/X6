import { Context } from 'probot'
import { v4 as uuidv4 } from 'uuid'
import { Config } from './config'
import { State } from './types'
import { Util } from './util'

export namespace Status {
  export async function get(context: Context): Promise<State> {
    const { pull_request: pr } = context.payload
    const labels: string[] = pr.labels.map((label: any) => label.name)
    const body = pr.body

    if (/@wip ready for review/i.test(body)) {
      return {
        wip: false,
        override: true,
      }
    }

    const { configs, manual } = await Config.get(context)

    let commitSubjects: string[] | null = null

    for (let i = 0; i < configs.length; i += 1) {
      const matchText = Util.getMatcher(configs[i].terms, configs[i].locations)
      let match = matchText('title', pr.title)
      if (match == null) {
        const matches = labels
          .map((label) => matchText('label', label))
          .filter((m) => m != null)
        match = matches[0]!
      }

      if (match == null) {
        if (commitSubjects == null) {
          commitSubjects = (await Util.getCommitSubjects(context)) || []
        }

        if (commitSubjects.length) {
          const matches = commitSubjects
            .map((subject) => matchText('commit', subject))
            .filter((m) => m != null)
          match = matches[0]!
        }
      }

      if (match) {
        return {
          configs,
          manual,
          wip: true,
          ...match,
        }
      }
    }

    return {
      configs,
      manual,
      wip: false,
    }
  }

  const checkName = 'WIP'

  export async function hasChange(context: Context, nextState: State) {
    const { data } = await context.github.checks.listForRef(
      context.repo({
        ref: context.payload.pull_request!.head.sha,
        check_name: checkName,
      }),
    )

    const checkRuns = data.check_runs.filter(
      (item) =>
        item.external_id != null &&
        item.external_id.startsWith(`[${checkName}]`),
    )

    if (checkRuns.length === 0) {
      context.log('[wip] No previous check runs.')
      return true
    }

    context.log(`[wip] Found check runs: ${checkRuns.length}`)

    const [{ conclusion, output }] = checkRuns
    const isWip = conclusion !== 'success'
    const hasOverride = output != null && /override/.test(output.title)
    const preOverride = nextState.override === true

    context.log(
      `[wip] Found check run: ${JSON.stringify({ conclusion, output })}`,
    )

    return isWip !== nextState.wip || hasOverride !== preOverride
  }

  export async function update(
    context: Context,
    nextState: State,
  ): Promise<any> {
    const options: {
      name: string
      status?: 'in_progress' | 'completed' | 'queued'
      conclusion?:
        | 'success'
        | 'failure'
        | 'neutral'
        | 'cancelled'
        | 'skipped'
        | 'timed_out'
        | 'action_required'
      started_at?: string
      completed_at?: string
    } = {
      name: checkName,
    }

    if (nextState.wip) {
      options.status = 'in_progress'
      options.started_at = new Date().toISOString()
    } else {
      options.status = 'completed'
      options.conclusion = 'success'
      options.completed_at = new Date().toISOString()
    }

    const output = Util.getOutput(context, nextState)

    context.log(`[wip] Create check run.`)
    context.log(`  metadata: ${JSON.stringify(options)}`)
    context.log(`  output: ${JSON.stringify(output)}`)

    const metadata = {
      ...options,
      output,
      external_id: `[${checkName}]${uuidv4()}`,
      head_sha: context.payload.pull_request!.head.sha,

      // workaround for https://github.com/octokit/rest.js/issues/874
      head_branch: '',

      // workaround random "Bad Credentials" errors
      // https://github.community/t5/GitHub-API-Development-and/Random-401-errors-after-using-freshly-generated-installation/m-p/22905/highlight/true#M1596
      request: {
        retries: 3,
        retryAfter: 3,
      },
    }

    return context.github.checks.create(context.repo(metadata))
  }
}
