const path = require('path');
const tar = require('tar');
const fse = require('fs-extra');
const ora = require('ora');

const envSetup = require('../../e2e/jest-global.setup');
const {
    TestDbmss,
    envPaths,
    resolveRelateJavaHome,
    downloadJava,
    TEST_NEO4J_VERSIONS,
    TEST_NEO4J_EDITION,
    TEST_DBMS_CREDENTIALS,
} = require('../../packages/common');
const {List} = require('../../packages/types');

envSetup();

async function populateDistributionCache(env) {
    const versions = List.of(Object.values(TEST_NEO4J_VERSIONS));

    if (!(await resolveRelateJavaHome(TEST_NEO4J_VERSIONS.default))) {
        const spinner = ora('Downloading Java').start();
        try {
            await downloadJava(TEST_NEO4J_VERSIONS.default);
        } catch (err) {
            spinner.fail();
            throw err;
        }
        spinner.succeed();
    }

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
                TEST_NEO4J_EDITION,
                TEST_DBMS_CREDENTIALS,
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

    const env = (await TestDbmss.init('relate')).environment;

    await fse.emptyDir(env.dataPath);
    await fse.emptyDir(envPaths().data);
    await fse.ensureFile(path.join(envPaths().data, '.GITIGNORED'));
    await fse.ensureFile(path.join(envPaths().cache, '.GITIGNORED'));
    await fse.ensureFile(path.join(envPaths().data, 'acceptedTerms'));

    await populateDistributionCache(env);

    // Some tests require an archive of the DBMS to be passed to them, and
    // during installation we only keep the extracted directory, so we compress
    // that directory here.
    const version = (await env.dbmss.versions())
        .find((v) => v.version === TEST_NEO4J_VERSIONS.default)
        .getOrElse(() => {
            throw new Error(`Couldn't find Neo4j version: ${TEST_NEO4J_VERSIONS.default}`);
        });

    // The value of TestDbmss.ARCHIVE_PATH is set before we override the environment
    // variables so it might be pointing to the wrong path. That's why we only use
    // the name of the archive and set the rest of the path manually.
    const archiveName = path.basename(TestDbmss.ARCHIVE_PATH);
    await tar.c(
        {
            gzip: true,
            file: path.join(env.dirPaths.dbmssCache, archiveName),
            cwd: env.dirPaths.dbmssCache,
        },
        [path.basename(version.dist)],
    );
}

console.log('Setting up tests');
globalSetup().then(() => console.log('Setup complete'));
