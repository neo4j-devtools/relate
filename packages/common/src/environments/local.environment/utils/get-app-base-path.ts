import _ from 'lodash';

import {getInstalledExtensions} from '../../../utils/get-installed-extensions';
import {EXTENSION_TYPES} from '../../../constants';
import {NotFoundError} from '../../../errors/not-found.error';
import {discoverExtension} from './extension-versions';

export async function getAppBasePath(appName: string): Promise<string> {
    const installed = await getInstalledExtensions();
    const app = _.find(installed, ({type, name}) => type === EXTENSION_TYPES.STATIC && name === appName);

    if (!app) {
        throw new NotFoundError(`App ${appName} not found`);
    }

    const {name, manifest} = await discoverExtension(app.root);
    const appBase = `/${name}`;
    let main = _.startsWith(manifest.main, '.') ? manifest.main.substr(1) : manifest.main;
    main = _.startsWith(manifest.main, '/') ? manifest.main.substr(1) : manifest.main;

    return `${appBase}/${main}`;
}
