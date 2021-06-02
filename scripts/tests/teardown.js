const path = require('path');
const fse = require('fs-extra');

const envSetup = require('../../e2e/jest-global.setup');
const {TestDbmss, DBMS_DIR_NAME} = require('../../packages/common');
const {List} = require('../../packages/types');

envSetup();

async function globalTeardown() {
    const env = (await TestDbmss.init('relate')).environment;

    const dbmss = await env.dbmss.list();
    await dbmss
        .mapEach(async (dbms) => {
            await env.dbmss.stop([dbms.id]);
            await env.dbmss.uninstall(dbms.id);
        })
        .unwindPromises()
        .catch((err) => console.error(err));

    const cacheFiles = List.from(await fse.readdir(env.cachePath))
        .filter((filename) => !['.GITIGNORED', 'dbmss', 'runtime'].includes(filename))
        .mapEach((filename) => path.join(env.cachePath, filename));

    const dbmssPath = path.join(env.dataPath, DBMS_DIR_NAME);
    try {
        // Do not remove this directory if not empty, it could lead to unexpected behavior.
        await fse.rmdir(dbmssPath);
    } catch {
        // If the DBMS directory is not empty by now it means stopping and
        // uninstalling through relate didn't work as expected. This is a last
        // resort attempt to kill all running DBMSs and empty the directory.
        const files = await fse.readdir(dbmssPath);
        await List.from(files)
            .mapEach(async (filename) => {
                const filePath = path.join(dbmssPath, filename);

                try {
                    // Try unlinking the path. This will work only if it's a
                    // file or symlink. It's not possible to check this in advance
                    // because if a symlink is pointing to a path that no longer
                    // exists, fse.stat will fail.
                    await fse.unlink(filePath);
                    return;
                } catch {}

                const pidPath = path.join(filePath, 'run', 'neo4j.pid');

                const dbmsIsRunning = await fse.pathExists(pidPath);
                if (dbmsIsRunning) {
                    const pid = await fse.readFile(pidPath).then((p) => p.toString().trim());

                    // https://nodejs.org/api/process.html#process_signal_events
                    await process.kill(pid, 'SIGKILL');
                    console.log(`Killed DBMS process "${pid}"`);
                }

                await fse.remove(path.join(filePath));
            })
            .unwindPromises();
    }

    const dataFiles = List.from(await fse.readdir(env.dataPath))
        .filter((filename) => !['.GITIGNORED', 'acceptedTerms'].includes(filename))
        .mapEach((filename) => path.join(env.dataPath, filename));

    await List.from()
        .concat(cacheFiles)
        .concat(dataFiles)
        .mapEach((filepath) => fse.remove(filepath))
        .unwindPromises();
}

globalTeardown()
    .then(() => console.log('Teardown complete'))
    .catch((err) => console.error(err));
