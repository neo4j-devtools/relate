import chokidar, {FSWatcher} from 'chokidar';
import {PubSub} from 'graphql-subscriptions';
import path from 'path';
import {debounce} from 'lodash';

// @todo: should replace this in production: https://docs.nestjs.com/graphql/subscriptions#code-first
export const pubSub = new PubSub();

export enum DBMS_EVENT_TYPE {
    STARTED = 'started',
    STOPPED = 'stopped',
    INSTALLED = 'installed',
    UNINSTALLED = 'uninstalled',
}

export const setDbmsWatcher = (watchPath: string[]): FSWatcher => {
    const watcher = chokidar.watch(watchPath, {
        followSymlinks: true,
        ignoreInitial: true,
        persistent: true,
        awaitWriteFinish: true,
    });

    const fileEventHandler = (eventType: DBMS_EVENT_TYPE.STARTED | DBMS_EVENT_TYPE.STOPPED) => (e: string) => {
        if (path.extname(e) === '.pid') {
            // determine dbmsId from chokidar event
            const dbmsIdCheck = e.match(/dbms-([^/]+)/);
            const dbmsId = dbmsIdCheck ? dbmsIdCheck[1] : '';
            if (dbmsId) {
                pubSub.publish('infoDbmssUpdate', {
                    dbmsId,
                    eventType,
                });
            }
        }
    };

    const dirEventHandler = (eventType: DBMS_EVENT_TYPE.INSTALLED | DBMS_EVENT_TYPE.UNINSTALLED) =>
        // debounce for now as multiple events for addDir (different flags)
        debounce(
            (e: string) => {
                // determine dbmsId from chokidar event
                // only interested in the top level dir
                // so ignore any events with a trailing slash
                const dbmsDirIdCheck = e.match(/dbms-([\w-]+[^/]$)/);
                const dbmsId = dbmsDirIdCheck ? dbmsDirIdCheck[1] : '';
                if (dbmsId) {
                    pubSub.publish('infoDbmssUpdate', {
                        dbmsId,
                        eventType,
                    });
                }
            },
            500,
            {trailing: true},
        );

    // determine dbms start / stop (add / unlink of pid file respectively)
    watcher.on('add', fileEventHandler(DBMS_EVENT_TYPE.STARTED));
    watcher.on('unlink', fileEventHandler(DBMS_EVENT_TYPE.STOPPED));
    // determine dbms install / uninstall (addDir / unlinkDir of top level DBMS dir respectively)
    watcher.on('addDir', dirEventHandler(DBMS_EVENT_TYPE.INSTALLED));
    watcher.on('unlinkDir', dirEventHandler(DBMS_EVENT_TYPE.UNINSTALLED));

    return watcher;
};
