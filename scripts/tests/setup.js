const path = require('path');
const tar = require('tar');
const fse = require('fs-extra');
const ora = require('ora');

const envSetup = require('../../e2e/jest-global.setup');
const {TestDbmss, DBMS_DIR_NAME, envPaths, download, PropertiesFile} = require('../../packages/common');
const {List} = require('../../packages/types');

envSetup();
const dbmssCache = path.join(process.env.NEO4J_RELATE_CACHE_HOME, DBMS_DIR_NAME);

// @todo - replace this with functionality from the common package once we're handling plugins there.
async function downloadApoc(dbmsRootPath) {
    await fse.ensureDir(path.join(dbmsRootPath, 'plugins'));
    const tmpFilePath = await download(
        'https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.17/apoc-4.0.0.17-all.jar',
        path.join(dbmsRootPath, 'plugins'),
    );
    await fse.move(tmpFilePath, path.join(path.dirname(tmpFilePath), 'apoc-4.0.0.17-all.jar'), {
        overwrite: true,
    });
}

// @todo - replace with functionality from the common package once we're handling plugins there.
async function setupApoc(dbmsRootPath) {
    const config = await PropertiesFile.readFile(path.join(dbmsRootPath, 'conf', 'neo4j.conf'));
    config.set('dbms.security.procedures.unrestricted', 'apoc.*');
    await config.flush();
}

async function populateDistributionCache(env) {
    const versions = List.of([TestDbmss.NEO4J_VERSION, '3.5.19', '4.0.5', '4.0.6', '4.1.0']);

    // Running the installations in sequence to avoid hogging resources
    // (we're decompressing archives during the installation).
    for (const version of versions) {
        // This step is to populate the cache with the versions we want to test
        // (in case the cache is not already populated). The DBMS is uninstalled
        // right after as we're not really doing anything with it, we only care about
        // the cached directory we get during installation.

        const spinner = ora(`Caching Neo4j ${version}`).start();

        try {
            await env.dbmss.install(
                `global-setup-${version}`,
                version,
                TestDbmss.NEO4J_EDITION,
                TestDbmss.DBMS_CREDENTIALS,
                false,
            );
            await env.dbmss.uninstall(`global-setup-${version}`);
        } catch (err) {
            spinner.fail(err.message);
            throw err;
        }
        spinner.succeed();
    }
}

async function globalSetup() {
    console.log('Preparing environment');
    await fse.emptyDir(envPaths().data);
    await fse.ensureFile(path.join(envPaths().data, '.GITIGNORED'));
    await fse.ensureFile(path.join(envPaths().cache, '.GITIGNORED'));
    await fse.ensureFile(path.join(envPaths().data, 'acceptedTerms'));

    const env = (await TestDbmss.init('relate')).environment;

    await populateDistributionCache(env);

    // Some tests require an archive of the DBMS to be passed to them, and
    // during installation we only keep the extracted directory, so we compress
    // that directory here.
    const version = (await env.dbmss.versions())
        .find((v) => v.version === TestDbmss.NEO4J_VERSION)
        .getOrElse(() => {
            throw new Error(`Couldn't find Neo4j version: ${TestDbmss.NEO4J_VERSION}`);
        });

    // The value of TestDbmss.ARCHIVE_PATH is set before we override the environment
    // variables so it might be pointing to the wrong path. That's why we only use
    // the name of the archive and set the rest of the path manually.
    const archiveName = path.basename(TestDbmss.ARCHIVE_PATH);
    await tar.c(
        {
            gzip: true,
            file: path.join(dbmssCache, archiveName),
            cwd: dbmssCache,
        },
        [path.basename(version.dist)],
    );
}

console.log('Setting up tests');
globalSetup().then(() => console.log('Setup complete'));
