import React from "react"
import { ColorPicker } from "@antv/x6-components"

export default class ColorPickerExample extends React.PureComponent {
  render() {
    return (
      <div style={{ height: "100%" }}>
        <div style={{ width: 120 }}>
          <ColorPicker value="#333333" />
        </div>
      </div>
    )
  }
}
