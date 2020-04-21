#!/usr/bin/env node
/* eslint-disable */

require('../dist/index.js')
    .bootstrap()
    .then(require('@oclif/command/flush'))
    .catch(require('@oclif/errors/handle'));
