import {Str} from '@relate/types';

import {getInstalledExtensionsSync} from './get-installed-extensions';
import {EXTENSION_TYPES} from '../../constants';
import {NotFoundError} from '../../errors/not-found.error';
import {discoverExtension} from './extension-versions';
import {isValidUrl} from '../generic';

export async function getAppBasePath(appName: string): Promise<string> {
    const installed = getInstalledExtensionsSync();
    const app = installed
        .find(({type, name}) => type === EXTENSION_TYPES.STATIC && name === appName)
        .getOrElse(() => {
            throw new NotFoundError(`App ${appName} not found`);
        });

    const {name, main: mainExtension} = await discoverExtension(app.root);
    const appBase = `/${name}`;

    if (isValidUrl(mainExtension)) {
        return mainExtension;
    }

    return Str.from(mainExtension)
        .map((main) => (main.startsWith('.') ? main.substr(1) : main))
        .map((main) => (main.startsWith('/') ? main.substr(1) : main))
        .flatMap((main) => `${appBase}/${main}`);
}
