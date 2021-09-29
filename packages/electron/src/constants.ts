import {app} from 'electron';

export const ELECTRON_IS_READY = new Promise<void>((resolve) => {
    if (app.isReady()) {
        resolve();
        return;
    }

    app.once('ready', () => {
        resolve();
    });
});
