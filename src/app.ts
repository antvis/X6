import { Application } from 'probot'
// import { Welcome } from './welcome'
// import { AutoAssign } from './auto-assign'
// import { AutoComment } from './auto-comment'
// import { RequestInfo } from './request-info'
// import { LabelActions } from './label-actions'

export = (app: Application) => {
  app.on('*', async (context) => {
    context.log(`event: ${context.name}`)
  })

  // Welcome.start(app)
  // AutoComment.start(app)
  // AutoAssign.start(app)
  // RequestInfo.start(app)
  // LabelActions.start(app)
}
