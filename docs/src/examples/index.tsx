import React from 'react'
import { Route, Link } from 'react-router-dom'
import { HelloWorld } from './helloworld'
import { HelloPort } from './helloport'
import { Constraints } from './constraints'
import { Guide } from './guide'
import { Layers } from './layers'
import { Translate } from './translate'
import './index.less'

export const Examples: React.SFC<Examples.Props> = () => (
  <div className="examples">
    <div className="examples-nav">
      <h2>
        X6 Examples
     </h2>
      <ul>
        <li>
          <Link to="/examples/helloworld">Hello World</Link>
        </li>
        <li>
          <Link to="/examples/helloport">Hello Port</Link>
        </li>
        <li>
          <Link to="/examples/constraints">Constraints</Link>
        </li>
        <li>
          <Link to="/examples/guide">Guide</Link>
        </li>
        <li>
          <Link to="/examples/layers">Layers</Link>
        </li>
        <li>
          <Link to="/examples/translate">Translate</Link>
        </li>
      </ul>
    </div>
    <div className="examples-content">
      <Route path="/examples/helloworld" component={HelloWorld} />
      <Route path="/examples/helloport" component={HelloPort} />
      <Route path="/examples/constraints" component={Constraints} />
      <Route path="/examples/guide" component={Guide} />
      <Route path="/examples/layers" component={Layers} />
      <Route path="/examples/translate" component={Translate} />
    </div>
  </div>
)

export namespace Examples {
  export interface Props { }
}
