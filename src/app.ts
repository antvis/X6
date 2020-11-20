import { Application, Context } from 'probot'
import { PRTriage } from './pr-triage'

export = (app: Application) => {
  app.on('*', async (context: Context) => {
    context.log(`event: ${context.name}`)
  })

  PRTriage.start(app)
}
