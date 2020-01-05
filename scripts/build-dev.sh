#!/bin/sh

lerna run build --scope @antv/x6-components &
lerna run build --scope @antv/x6-util
await

lerna run build --scope @antv/x6-dom-util &
lerna run build --scope @antv/x6-dom-event &
lerna run build --scope @antv/x6-event-emitter &
lerna run build --scope @antv/x6-geometry
await

lerna run build --scope @antv/x6
lerna run build --scope @antv/x6-react-shape





