import { Application } from 'probot'

export namespace AutoAddLabel {
  const presets = {
    fix: {
      hack: 'hack',
      default: 'bug',
    },
    chore: {
      deps: 'dependencies',
      default: 'chore',
    },
    feat: {
      default: 'enhancement',
    },
    docs: {
      default: 'documentation',
    },
    perf: {
      default: 'performance',
    },
  }

  function getLabel(title: string) {
    // see: https://regex101.com/r/HXVlTU/2
    const regex = /(\w*)(!?)(?:\((.*)\)(!?))?: (.*)/
    const matches = title.match(regex)
    if (!matches) {
      return null
    }

    const [, type, typeMark, scope, scopeMark] = matches
    if (typeMark || scopeMark) {
      return 'breaking-change'
    }

    const preset = presets[type as keyof typeof presets] as any
    return preset ? preset[scope] || preset.default : type
  }

  export function start(app: Application) {
    app.on(['pull_request.opened', 'pull_request.edited'], async (context) => {
      const {
        payload: {
          changes,
          pull_request: { title, labels },
        },
      } = context

      const label = getLabel(title)
      const oldLabel =
        changes && changes.title ? getLabel(changes.title.from) : null

      if (oldLabel && label !== oldLabel) {
        await context.github.issues.removeLabel(
          context.issue({
            name: oldLabel,
          }),
        )
      }

      if (!label) {
        return
      }

      if (labels.some((l: any) => l.name === label)) {
        return
      }

      await context.github.issues.addLabels(context.issue({ labels: [label] }))
    })
  }
}
