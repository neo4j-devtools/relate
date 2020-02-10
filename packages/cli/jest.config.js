module.exports = {
    roots: ['src'],
    testEnvironment: 'node',
    testRegex: '.*.(test|e2e).ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
