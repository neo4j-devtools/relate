const path = require('path');

module.exports = function globalSetup() {
    process.env.NODE_ENV = 'test';
    process.env.NEO4J_RELATE_CONFIG_HOME = path.join(__dirname, 'fixtures/config');
    process.env.NEO4J_RELATE_DATA_HOME = path.join(__dirname, 'fixtures/data');
    process.env.NEO4J_RELATE_CACHE_HOME = path.join(__dirname, 'fixtures/cache');
    process.env.TEST_NEO4J_VERSION = process.env.TEST_NEO4J_VERSION || '4.0.4';
};
