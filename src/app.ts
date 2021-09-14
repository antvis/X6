import { Application, Context } from 'probot'
import { WIP } from './wip'
// import { PRTriage } from './pr-triage'

export = (app: Application) => {
  app.on('*', async (context: Context) => {
    context.log(`event: ${context.name}`)
  })

  WIP.start(app)
  // PRTriage.start(app)
}
