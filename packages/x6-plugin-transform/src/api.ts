import { TransformImpl } from './transform'

declare module '@antv/x6/lib/graph/events' {
  interface EventArgs extends TransformImpl.EventArgs {}
}
