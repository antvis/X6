import React from 'react'
import { Route, Link } from 'react-router-dom'
import { HelloWorld } from './hello-world'
import { Layers } from './layers'
import './index.less'

export const Examples: React.SFC<Examples.Props> = () => (
  <div className="examples">
    <div className="examples-nav">
      <h2>
        X6 Examples
     </h2>
      <ul>
        <li>
          <Link to="/examples/hello-world">Hello World</Link>
        </li>
        <li>
          <Link to="/examples/layers">Layers</Link>
        </li>
      </ul>
    </div>
    <div className="examples-content">
      <Route path="/examples/hello-world" component={HelloWorld} />
      <Route path="/examples/layers" component={Layers} />
    </div>
  </div>
)

export namespace Examples {
  export interface Props { }
}
