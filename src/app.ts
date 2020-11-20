import { Application, Context } from 'probot'
import { Octokit } from '@octokit/rest'
import { PRTriage } from './pr-triage'

export = (app: Application) => {
  app.on('*', async (context: Context) => {
    context.log(`event: ${context.name}`)

    const { data: repo } = await context.github.repos.get(context.repo())
    const { data: app } = await context.github.apps.getBySlug({
      app_slug: 'pr-triage',
    })

    const octokit = new Octokit({ auth: process.env.PAT })

    context.log(process.env.PAT!)
    context.log(`repository_id: ${repo.id}`)
    context.log(`installation_id: ${app.id}`)

    // await octokit.apps.suspendInstallation({
    //   installation_id: app.id,
    // })

    await octokit.apps.removeRepoFromInstallation({
      repository_id: repo.id,
      installation_id: app.id,
    })
  })

  PRTriage.start(app)
}
