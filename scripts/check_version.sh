#!/bin/bash

VERSION=$(node -e "(function () { console.log(require('./package.json').version) })()")

if grep $VERSION ./src/settings/defaults.ts; then
  echo 'SDK VERSION IS OKEY'
  exit 0
else
  echo 'SDK VERSION IS WRONG OR COULD NOT BE FOUND'
  exit 1
fi
