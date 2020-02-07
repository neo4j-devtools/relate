module.exports = {
    roots: ['src'],
    testRegex: '.*.(test|e2e).ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
