const globalConf = require('../../e2e/jest-global.config');

module.exports = {
    ...globalConf,
    roots: ['src'],
    testRegex: '.*.test.ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
