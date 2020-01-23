module.exports = {
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
