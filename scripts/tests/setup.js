const path = require('path');
const tar = require('tar');
const fse = require('fs-extra');

const envSetup = require('../../e2e/jest-global.setup');
const {TestDbmss, DBMS_DIR_NAME, envPaths} = require('../../packages/common');

envSetup();
const dbmssCache = path.join(process.env.NEO4J_RELATE_CACHE_HOME, DBMS_DIR_NAME);

async function globalSetup() {
    await fse.emptyDir(envPaths().data);
    await fse.emptyDir(envPaths().cache);
    await fse.ensureFile(path.join(envPaths().data, '.GITIGNORED'));
    await fse.ensureFile(path.join(envPaths().cache, '.GITIGNORED'));
    await fse.ensureFile(path.join(envPaths().data, 'acceptedTerms'));

    const env = (await TestDbmss.init('relate')).environment;


    // This step is to populate the cache with the version we want to test
    // (in case the cache is not already populated). The DBMS is uninstalled
    // right after as we're not really doing anything with it, we only care about
    // the cached directory we get during installation.
    await env.dbmss.install('global-setup', 'password', TestDbmss.NEO4J_VERSION);
    await env.dbmss.uninstall('global-setup');

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

globalSetup().then(() => console.log('Setup complete'));
