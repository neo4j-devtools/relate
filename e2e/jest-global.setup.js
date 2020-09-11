const path = require('path');

module.exports = function globalSetup() {
    process.env.NODE_ENV = 'test';
    process.env.NEO4J_RELATE_CONFIG_HOME = path.join(__dirname, 'relate fixtures/config');
    process.env.NEO4J_RELATE_DATA_HOME = path.join(__dirname, 'relate fixtures/data');
    process.env.NEO4J_RELATE_CACHE_HOME = path.join(__dirname, 'relate fixtures/cache');
    process.env.TEST_NEO4J_VERSION = process.env.TEST_NEO4J_VERSION || '4.0.4';
    process.env.TEST_NEO4J_EDITION = process.env.TEST_NEO4J_EDITION || 'enterprise';
};
