import { Application, Context } from 'probot'
import { PRTriage } from './pr-triage'

export = (app: Application) => {
  app.on('*', async (context: Context) => {
    context.log(`event: ${context.name}`)

    const { data: repo } = await context.github.repos.get(context.repo())
    const { data: app } = await context.github.apps.getBySlug({
      app_slug: 'pr-triage',
    })

    context.log(`repository_id: ${repo.id}`)
    context.log(`installation_id: ${app.id}`)

    await context.github.apps.suspendInstallation({
      installation_id: app.id,
    })

    await context.github.apps.removeRepoFromInstallation({
      repository_id: repo.id,
      installation_id: app.id,
    })
  })

  PRTriage.start(app)
}
