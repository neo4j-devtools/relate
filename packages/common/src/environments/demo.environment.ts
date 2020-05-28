import {LocalEnvironment} from './local.environment';
import {IExtensionMeta, IExtensionVersion} from './local.environment/utils';
import {NotAllowedError} from '../errors';
import {IDbmsVersion} from '../models';

export class DemoEnvironment extends LocalEnvironment {
    listInstalledExtensions(): Promise<IExtensionMeta[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support listing installed extensions`);
    }

    listDbmsVersions(): Promise<IDbmsVersion[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support listing DBMS versions`);
    }

    installDbms(_name: string, _credentials: string, _version: string): Promise<string> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support installing a DBMS`);
    }

    uninstallDbms(_name: string): Promise<void> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support uninstalling a DBMS`);
    }

    startDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support starting DBMSs`);
    }

    stopDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support stopping DBMSs`);
    }

    updateDbmsConfig(_dbmsId: string, _properties: Map<string, string>): Promise<void> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support updating DBMSs config`);
    }

    linkExtension(_filePath: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support linking extensions`);
    }

    installExtension(_name: string, _version: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support installing extensions`);
    }

    uninstallExtension(_name: string): Promise<IExtensionMeta[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support uninstalling extensions`);
    }

    listExtensionVersions(): Promise<IExtensionVersion[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support listing extension versions`);
    }
}
