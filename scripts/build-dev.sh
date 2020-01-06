#!/bin/sh

lerna run build --scope @antv/x6-components &
lerna run build --scope @antv/x6

await

lerna run build --scope @antv/x6-react-shape





