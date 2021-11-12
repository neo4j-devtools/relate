import chokidar, {FSWatcher} from 'chokidar';
import {PubSub} from 'graphql-subscriptions';
import {debounce} from 'lodash';
import path from 'path';

// @todo: should replace this in production: https://docs.nestjs.com/graphql/subscriptions#code-first
export const pubSub = new PubSub();

export enum DBMS_EVENT_TYPE {
    STARTED = 'started',
    STOPPED = 'stopped',
    INSTALLED = 'installed',
    UNINSTALLED = 'uninstalled',
}

// @todo: currently geared towards watching DBMS files/folders specifically
export const setWatcher = (watchPath: string[]): FSWatcher => {
    const watcher = chokidar.watch(watchPath, {
        persistent: true,
        ignoreInitial: true,
    });

    const eventHandler = (eventType: DBMS_EVENT_TYPE) =>
        debounce(
            // eslint-disable-next-line max-statements
            (e: string) => {
                if (eventType === DBMS_EVENT_TYPE.INSTALLED || eventType === DBMS_EVENT_TYPE.UNINSTALLED) {
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
                }
                if (eventType === DBMS_EVENT_TYPE.STARTED || DBMS_EVENT_TYPE.STOPPED) {
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
                }
            },
            500,
        );

    // determine dbms start / stop (add / unlink of pid file respectively)
    watcher.on('add', eventHandler(DBMS_EVENT_TYPE.STARTED));
    watcher.on('unlink', eventHandler(DBMS_EVENT_TYPE.STOPPED));
    // determine dbms install / uninstall (addDir / unlinkDir of top level DBMS dir respectively)
    watcher.on('addDir', eventHandler(DBMS_EVENT_TYPE.INSTALLED));
    watcher.on('unlinkDir', eventHandler(DBMS_EVENT_TYPE.UNINSTALLED));

    return watcher;
};
