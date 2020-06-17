const path = require('path');
const fse = require('fs-extra');

const envSetup = require('../../e2e/jest-global.setup');
const {TestDbmss, DBMS_DIR_NAME} = require('../../packages/common');
const {List} = require('../../packages/types');

envSetup();
const cachePath = process.env.NEO4J_RELATE_CACHE_HOME;
const dataPath = process.env.NEO4J_RELATE_DATA_HOME;

async function globalTeardown() {
    const env = (await TestDbmss.init('relate')).environment;

    const dbmss = await env.dbmss.list();
    await dbmss
        .mapEach(async (dbms) => {
            await env.dbmss.stop([dbms.id]);
            await env.dbmss.uninstall(dbms.id);
        })
        .unwindPromises();

    const cacheFiles = List.from(await fse.readdir(cachePath))
        .filter((filename) => !['.GITIGNORED', 'dbmss'].includes(filename))
        .mapEach((filename) => path.join(cachePath, filename));

    const dataFiles = List.from(await fse.readdir(dataPath))
        .filter((filename) => !['.GITIGNORED', 'dbmss'].includes(filename))
        .mapEach((filename) => path.join(dataPath, filename));

    await List.from()
        .concat(cacheFiles)
        .concat(dataFiles)
        .mapEach((filepath) => fse.remove(filepath))
        .unwindPromises();

    // Do not remove this directory if not empty, it could lead to unexpected behavior.
    await fse.rmdir(path.join(dataPath, DBMS_DIR_NAME));
}

globalTeardown()
    .then(() => console.log('Teardown complete'))
    .catch((err) => console.error(err));
