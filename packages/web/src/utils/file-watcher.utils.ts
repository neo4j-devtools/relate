import chokidar, {FSWatcher} from 'chokidar';
import {PubSub} from 'graphql-subscriptions';

// @todo: should replace this in production: https://docs.nestjs.com/graphql/subscriptions#code-first
export const pubSub = new PubSub();

export const setWatcher = (watchPath: string): FSWatcher => {
    const watcher = chokidar.watch(watchPath, {
        persistent: true,
        ignoreInitial: true,
    });

    // determine dbmsId from chokidar event
    const eventHandler = (e: string) => {
        const dbmsIdCheck = e.match(/dbms-([^/]+)/);
        const dbmsId = dbmsIdCheck ? dbmsIdCheck[1] : '';
        pubSub.publish('infoDbmssUpdate', {dbmsId});
    };

    // determine dbms start / stop (add / unlink of pid file respectively)
    watcher.on('add', eventHandler);
    watcher.on('unlink', eventHandler);

    return watcher;
};
