import emojiToName from '../../node_modules/gemoji/emoji-to-name.json'
import { Context } from 'probot'
import { Location, State } from './types'
import { Doc } from './doc'

export namespace Util {
  export async function getCommitSubjects(context: Context) {
    const { data: commits } = await context.github.pulls.listCommits(
      context.repo({
        pull_number: context.payload.pull_request.number,
      }),
    )

    return commits.map((e) => e.commit.message.split('\n')[0])
  }

  const matchTerms = (terms: string[], text: string) => {
    // JS RegExp defines explicitly defines a \w word character as: [A-Za-z0-9_]
    // Therefore, \b word boundaries only work for words that start/end with an above word character.
    // e.g.
    //   > /\b🚧\b/i.test('🚧')
    //   < false
    // but
    //   > /\bGIT🚧GIT\b/i.test('GIT🚧GIT')
    //   < true
    // and
    //   > /\bfixup!\b/i.test('fixup!')
    //   < false

    // A decision has been made to enforce word boundaries for all match terms, excluding terms which contain only non-word \W characters.
    // Therefore, we prepend and append a \W look-behind and look-ahead on all terms which DO NOT match /^\W+$/i.
    const wordBoundaryTerms = terms.map((str) => {
      return str.replace(/^(.*\w+.*)$/i, '(?<=^|\\W)$1(?=\\W|$)')
    })

    // Now concat all wordBoundaryTerms (terms with boundary checks added where appropriate) and match across entire text.
    // We only care whether a single instance is found at all, so a global search is not necessary and the first capture group is returned.
    const matches = text.match(
      new RegExp(`(${wordBoundaryTerms.join('|')})`, 'i'),
    )
    return matches ? matches[1] : null
  }

  export const getMatcher = (terms: string[], locations: Location[]) => (
    location: Location,
    text: string,
  ) => {
    if (!locations.includes(location)) {
      return null
    }

    const match = matchTerms(terms, text)
    return match ? { location, text, match } : null
  }

  const ucfirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  export function getOutput(context: Context, status: State) {
    const output: { title: string; summary: string; text?: string } = {
      title: '',
      summary: '',
    }

    if (status.wip) {
      let match = (emojiToName as any)[status.match!]
      if (match === undefined) {
        match = `"${status.match}"` // Text match
      } else {
        match = `a ${match} emoji` // Emoji match
      }

      const map = {
        title: 'title',
        label: 'label',
        commit: 'commit subject',
      }

      const location = map[status.location!]

      output.title = `${ucfirst(location)} contains ${match}`

      const pr = context.payload.pull_request!

      output.summary =
        // tslint:disable-next-line
        `The ${location} "${status.text}" contains "${status.match}".` +
        '\n' +
        '\n' +
        `You can override the status by adding "@wip ready for review" to the end of the [pull request description](${pr.html_url}#discussion_bucket).`

      output.text =
        // tslint:disable-next-line
        `The default configuration is applied:` +
        Doc.getDefaultConfiguration() +
        Doc.getREADME()
    } else {
      output.title = 'Ready for review'
    }

    if (status.override) {
      output.title += ' (override)'
      output.summary =
        'The status has been set to success by adding `@wip ready for review` to the pull request comment. ' +
        'You can reset the status by removing it.'
    } else if (status.manual) {
      output.text =
        // tslint:disable-next-line
        `The following configuration was applied:` +
        Doc.getManualConfiguration(status.configs!) +
        Doc.getREADME()
    }

    return output
  }
}
