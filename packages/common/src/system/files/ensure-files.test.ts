import fse from 'fs-extra';
import {promises as fs} from 'fs';
import path from 'path';
import _ from 'lodash';

import {envPaths} from '../../utils/';
import {ensureDirs, ensureFiles} from './ensure-files';
import {ILocalAccountDirPaths, ISystemProviderDirPaths, ISystemProviderFilePaths} from './ensure-files.constants';

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
        const paths: ILocalAccountDirPaths = {
            ...defaultPaths,
            neo4jDistributionPath: path.join(TMP_HOME, 'neo4jDist'),
        };
        await ensureDirs(paths);
        const dirFiles = await fs.readdir(TMP_HOME, {withFileTypes: true});
        expect(dirFiles.length).toBe(Object.keys(paths).length);

        expect(_.map(dirFiles, (file) => file.name).sort()).toEqual(expectedFileNames.sort());

        expect(_.filter(dirFiles, (file) => file.isFile()).length).toBe(0);
        expect(_.filter(dirFiles, (file) => file.isDirectory()).length).toBe(5);
    });

    test('ensureDirs and ensureFiles: ensure directories and files are created correctly', async () => {
        const expectedFileNames = [...defaultFileNames, 'accounts', 'known_connections'];
        const paths: ISystemProviderDirPaths = {
            ...defaultPaths,
            accountsPath: path.join(TMP_HOME, 'accounts'),
        };
        const files: ISystemProviderFilePaths = {
            knownConnections: path.join(TMP_HOME, 'known_connections'),
        };

        await ensureDirs(paths);
        await ensureFiles(files);
        const dirFiles = await fs.readdir(TMP_HOME, {withFileTypes: true});
        expect(dirFiles.length).toBe(Object.keys(paths).length + Object.keys(files).length);

        expect(_.map(dirFiles, (file) => file.name).sort()).toEqual(expectedFileNames.sort());

        expect(_.filter(dirFiles, (file) => file.isFile()).length).toBe(1);
        expect(_.filter(dirFiles, (file) => file.isDirectory()).length).toBe(5);
    });
});
