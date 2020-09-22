import { Context } from 'probot'
import { random, template } from 'lodash'

export namespace Util {
  export async function getConfig<T>(
    context: Context,
    defaults: T,
    filePath: string = 'x6bot-config.yml',
  ) {
    return context
      .config(filePath, defaults)
      .then((result) => result || defaults)
  }

  export function pickComment(
    comment: string | string[],
    args?: { [key: string]: string },
  ) {
    let result: string
    if (typeof comment === 'string' || comment instanceof String) {
      result = comment.toString()
    } else {
      const pos = random(0, comment.length, false)
      result = comment[pos] || comment[0]
    }

    return args ? template(result)(args) : result
  }

  export async function getFileContent(context: Context, path: string) {
    try {
      const res = await context.github.repos.getContent(
        context.repo({
          path,
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
        }),
      )
      return Buffer.from(res.data.content, 'base64').toString()
    } catch (err) {
      return null
    }
  }

  export async function getDirSubPaths(
    context: Context,
    path: string,
  ): Promise<string[] | null> {
    try {
      const res = await context.github.repos.getContent(context.repo({ path }))
      return (res.data as any).map((f: any) => f.path)
    } catch (err) {
      return null
    }
  }

  export async function getIssueTemplates(context: Context) {
    const defaultTemplate = await getFileContent(
      context,
      '.github/ISSUE_TEMPLATE.md',
    )

    if (defaultTemplate != null) {
      return [defaultTemplate]
    }

    const paths = await getDirSubPaths(context, '.github/ISSUE_TEMPLATE')
    if (paths !== null) {
      const templates = []
      for (const path of paths) {
        const template = await getFileContent(context, path)
        if (template != null) {
          templates.push(template)
        }
      }

      return templates
    }

    return []
  }

  export async function getPullRequestTemplate(context: Context) {
    return getFileContent(context, '.github/PULL_REQUEST_TEMPLATE.md')
  }

  export async function lockIssue(
    context: Context,
    lockReason?: string,
  ): Promise<any> {
    const params = lockReason
      ? context.issue({
          lock_reason: lockReason,
          headers: {
            Accept: 'application/vnd.github.sailor-v-preview+json',
          },
        })
      : context.issue()
    return context.github.issues.lock(params)
  }

  export async function ensureUnlock(
    context: Context,
    callback: (() => void) | (() => Promise<any>),
  ) {
    const { payload, github } = context
    const targetPayload = payload.issue || payload.pull_request
    if (targetPayload.locked) {
      const lockReason = targetPayload.active_lock_reason
      await github.issues.unlock(context.issue())
      await callback()
      await lockIssue(context, lockReason)
    } else {
      await callback()
    }
  }

  export function isIssue(context: Context) {
    return context.payload.issue != null
  }

  export function isPullRequest(context: Context) {
    return context.payload.pull_request != null
  }
}
