import fse from 'fs-extra';
import path from 'path';
import _ from 'lodash';

import {envPaths} from '../../utils/';
import {ensureDirs, ensureFiles} from './ensure-files';
import {ILocalEnvironmentDirPaths, ISystemProviderDirPaths, ISystemProviderFilePaths} from './ensure-files.constants';

const TMP_HOME = path.join(envPaths().tmp, 'ensure-files');

describe('ensure-files', () => {
    const defaultPaths = {
        cache: path.join(TMP_HOME, 'cache'),
        config: path.join(TMP_HOME, 'config'),
        data: path.join(TMP_HOME, 'data'),
        tmp: path.join(TMP_HOME, 'tmp'),
    };
    const defaultFileNames = Object.keys(defaultPaths);

    beforeEach(() => fse.ensureDir(TMP_HOME));

    afterEach(() => fse.remove(TMP_HOME));

    test('ensureDirs: ensure directories are created correctly', async () => {
        const expectedFileNames = [...defaultFileNames, 'dbmssCache', 'environmentsConfig'];
        const dirPaths: ILocalEnvironmentDirPaths = {
            ...defaultPaths,
            dbmssCache: path.join(TMP_HOME, 'dbmssCache'),
            environmentsConfig: path.join(TMP_HOME, 'environmentsConfig'),
        };
        await ensureDirs(dirPaths);
        const dirFiles = await fse.readdir(TMP_HOME, {withFileTypes: true});
        expect(dirFiles.length).toBe(Object.keys(dirPaths).length);

        expect(_.map(dirFiles, (file) => file.name).sort()).toEqual(expectedFileNames.sort());

        expect(_.filter(dirFiles, (file) => file.isFile()).length).toBe(0);
        expect(_.filter(dirFiles, (file) => file.isDirectory()).length).toBe(Object.keys(dirPaths).length);
    });

    test('ensureDirs and ensureFiles: ensure directories and files are created correctly', async () => {
        const expectedFileNames = [...defaultFileNames, 'environments', 'known_connections'];
        const dirPaths: ISystemProviderDirPaths = {
            ...defaultPaths,
            environments: path.join(TMP_HOME, 'environments'),
        };
        const filePaths: ISystemProviderFilePaths = {
            knownConnections: path.join(TMP_HOME, 'known_connections'),
        };

        await ensureDirs(dirPaths);
        await ensureFiles(filePaths);
        const dirFiles = await fse.readdir(TMP_HOME, {withFileTypes: true});
        expect(dirFiles.length).toBe(Object.keys(dirPaths).length + Object.keys(filePaths).length);

        expect(_.map(dirFiles, (file) => file.name).sort()).toEqual(expectedFileNames.sort());

        expect(_.filter(dirFiles, (file) => file.isFile()).length).toBe(1);
        expect(_.filter(dirFiles, (file) => file.isDirectory()).length).toBe(5);
    });
});
