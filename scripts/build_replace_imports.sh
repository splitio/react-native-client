#!/bin/bash

# replace splitio-commons imports to use ES modules build
replace '@splitsoftware/splitio-commons/src' '@splitsoftware/splitio-commons/esm' ./lib/module -r

# replace splitio-commons imports to use CommonJS build
replace '@splitsoftware/splitio-commons/src' '@splitsoftware/splitio-commons/cjs' ./lib/commonjs -r

if [ $? -eq 0 ]
then
  exit 0
else
  exit 1
fi
