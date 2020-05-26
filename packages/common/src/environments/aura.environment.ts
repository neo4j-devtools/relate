import {IAuthToken} from '@huboneo/tapestry';

import {NotAllowedError} from '../errors';
import {IDbms, IDbmsVersion, IEnvironmentAuth} from '../models';
import {IDbmsInfo} from '../models/environment-config.model';
import {IExtensionMeta} from '../utils';
import {EnvironmentAbstract} from './environment.abstract';

export class AuraEnvironment extends EnvironmentAbstract {
    login(): Promise<IEnvironmentAuth> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support login`);
    }

    listDbmsVersions(): Promise<IDbmsVersion[]> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support listing DBMS versions`);
    }

    installDbms(_name: string, _credentials: string, _version: string): Promise<string> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support installing a DBMS`);
    }

    uninstallDbms(_name: string): Promise<void> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support uninstalling a DBMS`);
    }

    listDbmss(): Promise<IDbms[]> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support listing DBMSs`);
    }

    getDbms(_nameOrId: string): Promise<IDbms> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support getting DBMS`);
    }

    startDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support starting DBMSs`);
    }

    stopDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support stopping DBMSs`);
    }

    infoDbmss(_dbmsIds: string[]): Promise<IDbmsInfo[]> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support getting DBMSs status`);
    }

    createAccessToken(_appId: string, _dbmsId: string, _authToken: IAuthToken): Promise<string> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support creating access tokens`);
    }

    updateDbmsConfig(_dbmsId: string, _properties: Map<string, string>): Promise<void> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support updating DBMSs config`);
    }

    getAppPath(_appName: string): Promise<string> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support getting app paths`);
    }

    listInstalledApps(): Promise<IExtensionMeta[]> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support listing installed extensions`);
    }

    linkExtension(_filePath: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support linking extensions`);
    }

    installExtension(_name: string, _version: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support installing extensions`);
    }

    uninstallExtension(_name: string): Promise<IExtensionMeta[]> {
        throw new NotAllowedError(`${AuraEnvironment.name} does not support uninstalling extensions`);
    }
}
