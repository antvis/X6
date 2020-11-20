import { Application, Context } from 'probot'
import { PRTriage } from './pr-triage'

export = (app: Application) => {
  app.on('*', async (context: Context) => {
    context.log(`event: ${context.name}`)

    const { data: repo } = await context.github.repos.get(context.repo())
    const { data: app } = await context.github.apps.getBySlug({
      app_slug: 'pr-triage',
    })

    await context.github.apps.removeRepoFromInstallation({
      installation_id: app.id,
      repository_id: repo.id,
    })

    context.log(repo)
    context.log(app)
  })

  PRTriage.start(app)
}
