import { Context } from 'probot'
import { Util } from '../util'

export namespace Core {
  export async function isIssueBodyValid(context: Context, body: string) {
    if (!body || !body.trim()) {
      return false
    }

    const templates = await Util.getIssueTemplates(context)
    for (const template of templates) {
      const b = body.trim().replace(/[\r\n]/g, '')
      const t = template.trim().replace(/[\r\n]/g, '')
      if (t.includes(b)) {
        return false
      }
    }

    return true
  }

  export async function isPullRequestBodyValid(context: Context, body: string) {
    if (!body || !body.trim()) {
      return false
    }

    const template = await Util.getPullRequestTemplate(context)
    if (template && body.includes(template)) {
      return false
    }

    return true
  }
}
