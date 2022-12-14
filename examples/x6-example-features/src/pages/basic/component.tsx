import React from "react";
import { Color, Graph, Node } from "@antv/x6";
export class MyComponent extends React.Component<{
  graph?: Graph;
  node?: Node<Node.Properties>;
  text?: string;
}> {
  shouldComponentUpdate() {
    const node = this.props.node;
    if (node) {
      if (node.hasChanged("data")) {
        return true;
      }
    }

    return false;
  }

  render() {
    const color = Color.randomHex();
    return (
      <div
        style={{
          color: Color.invert(color, true),
          width: "100%",
          height: "100%",
          textAlign: "center",
          lineHeight: "40px",
          background: color
        }}
      >
        {this.props.node?.data.text}
      </div>
    );
  }
}
