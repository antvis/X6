import { Application } from 'probot'
import { PRTriage } from './pr-triage'

export = (app: Application) => {
  app.on('*', async (context) => {
    context.log(`event: ${context.name}`)
  })

  PRTriage.start(app)
}
