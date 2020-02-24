const globalConf = require('../../e2e/jest-global.config');

module.exports = {
    ...globalConf,
    roots: ['src'],
    testRegex: '.*.(test|e2e).ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
