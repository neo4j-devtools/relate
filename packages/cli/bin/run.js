#!/usr/bin/env node
/* eslint-disable */
const path = require('path');

require(path.join(__dirname, '../dist/index.js'))
    .bootstrap()
    .then(require('@oclif/core/flush'))
    .catch(require('@oclif/core/handle'));
