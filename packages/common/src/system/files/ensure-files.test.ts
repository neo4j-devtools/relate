import fse from 'fs-extra';
import {promises as fs} from 'fs';
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
        const expectedFileNames = [...defaultFileNames, 'neo4jDist'];
        const dirPaths: ILocalEnvironmentDirPaths = {
            ...defaultPaths,
            neo4jDistribution: path.join(TMP_HOME, 'neo4jDist'),
        };
        await ensureDirs(dirPaths);
        const dirFiles = await fs.readdir(TMP_HOME, {withFileTypes: true});
        expect(dirFiles.length).toBe(Object.keys(dirPaths).length);

        expect(_.map(dirFiles, (file) => file.name).sort()).toEqual(expectedFileNames.sort());

        expect(_.filter(dirFiles, (file) => file.isFile()).length).toBe(0);
        expect(_.filter(dirFiles, (file) => file.isDirectory()).length).toBe(5);
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
        const dirFiles = await fs.readdir(TMP_HOME, {withFileTypes: true});
        expect(dirFiles.length).toBe(Object.keys(dirPaths).length + Object.keys(filePaths).length);

        expect(_.map(dirFiles, (file) => file.name).sort()).toEqual(expectedFileNames.sort());

        expect(_.filter(dirFiles, (file) => file.isFile()).length).toBe(1);
        expect(_.filter(dirFiles, (file) => file.isDirectory()).length).toBe(5);
    });
});
