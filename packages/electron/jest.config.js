const globalConf = require('../../e2e/jest-global.config');

module.exports = {
    ...globalConf,
    projects: [
        {
            roots: ['src'],
            runner: '@jest-runner/electron/main',
            testEnvironment: 'node',
            testRegex: '.*.(test|e2e).ts$',
            transform: {
                '^.+\\.ts$': 'ts-jest',
            },
        },
    ],
};
