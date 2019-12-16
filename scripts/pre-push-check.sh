#!/bin/sh

branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "master" ]; then
  echo "Push to master branch is forbidden."
  echo "Checkout your owne branch then submit a pr."
  exit 1
fi