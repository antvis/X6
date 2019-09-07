import React from 'react'
import { Route, Link } from 'react-router-dom'
import { HelloWorld } from './helloworld'
import { HelloPort } from './helloport'
import { Constraints } from './constraints'
import { Guide } from './guide'
import { Layers } from './layers'
import { Transform } from './transform'
import { Images } from './images'
import { Indicators } from './indicators'
import { LabelPosition } from './label-position'
import { Labels } from './labels'

import './index.less'

export const Examples: React.SFC<Examples.Props> = () => (
  <div className="examples">
    <div className="examples-nav">
      <h2>
        Examples
     </h2>
      <ul>
        <li><Link to="/examples/helloworld">Hello World</Link></li>
        <li><Link to="/examples/helloport">Hello Port</Link></li>
        <li><Link to="/examples/constraints">Constraints</Link></li>
        <li><Link to="/examples/guide">Guide</Link></li>
        <li><Link to="/examples/layers">Layers</Link></li>
        <li><Link to="/examples/transform">Transform</Link></li>
        <li><Link to="/examples/indicators">Indicators</Link></li>
        <li><Link to="/examples/images">Images</Link></li>
        <li><Link to="/examples/label-position">Label Position</Link></li>
        <li><Link to="/examples/labels">Labels</Link></li>
      </ul>
    </div>
    <div className="examples-content">
      <Route path="/examples/helloworld" component={HelloWorld} />
      <Route path="/examples/helloport" component={HelloPort} />
      <Route path="/examples/constraints" component={Constraints} />
      <Route path="/examples/guide" component={Guide} />
      <Route path="/examples/layers" component={Layers} />
      <Route path="/examples/transform" component={Transform} />
      <Route path="/examples/images" component={Images} />
      <Route path="/examples/indicators" component={Indicators} />
      <Route path="/examples/label-position" component={LabelPosition} />
      <Route path="/examples/labels" component={Labels} />
    </div>
  </div>
)

export namespace Examples {
  export interface Props { }
}
