import fse from 'fs-extra';
import {promises as fs} from 'fs';
import path from 'path';
import _ from 'lodash';

import {envPaths} from '../../utils/';
import {ensurePaths} from './ensure-files';
import {ILocalAccountDirPaths, ISystemProviderPaths} from './ensure-files.constants';

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

    test('ensurePaths: ensure directories are created correctly', async () => {
        const expectedFileNames = [...defaultFileNames, 'neo4jDist'];
        const paths: ILocalAccountDirPaths = {
            ...defaultPaths,
            neo4jDistributionPath: path.join(TMP_HOME, 'neo4jDist'),
        };
        await ensurePaths(paths);
        const dirFiles = await fs.readdir(TMP_HOME, {withFileTypes: true});
        expect(dirFiles.length).toBe(Object.keys(paths).length);

        expect(_.map(dirFiles, (file) => file.name).sort()).toEqual(expectedFileNames.sort());

        expect(_.filter(dirFiles, (file) => file.isFile()).length).toBe(0);
        expect(_.filter(dirFiles, (file) => file.isDirectory()).length).toBe(5);
    });

    test('ensurePaths: ensure directories and files are created correctly', async () => {
        const expectedFileNames = [...defaultFileNames, 'accounts', 'dbmss', 'known_connections'];
        const paths: ISystemProviderPaths = {
            ...defaultPaths,
            accountsPath: path.join(TMP_HOME, 'accounts'),
            dbmssPath: path.join(TMP_HOME, 'dbmss'),
            knownConnectionsFilePath: path.join(TMP_HOME, 'known_connections'),
        };

        await ensurePaths(paths);
        const dirFiles = await fs.readdir(TMP_HOME, {withFileTypes: true});
        expect(dirFiles.length).toBe(Object.keys(paths).length);

        expect(_.map(dirFiles, (file) => file.name).sort()).toEqual(expectedFileNames.sort());

        expect(_.filter(dirFiles, (file) => file.isFile()).length).toBe(1);
        expect(_.filter(dirFiles, (file) => file.isDirectory()).length).toBe(6);
    });
});
