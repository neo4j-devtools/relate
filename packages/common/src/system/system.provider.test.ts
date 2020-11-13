import {ConfigModule} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {EnvironmentAbstract} from '../entities/environments';
import fse from 'fs-extra';

import {ENVIRONMENT_TYPES} from '../entities/environments/environment.constants';
import {IEnvironmentConfigInput} from '../models/environment-config.model';
import {SystemModule} from './system.module';
import {SystemProvider} from './system.provider';
import {NotFoundError} from '../errors';

describe('System Provider', () => {
    let provider: SystemProvider;
    let newTestEnv: EnvironmentAbstract | null;

    afterAll(async () => {
        const {configPath, dataPath} = newTestEnv!;
        await Promise.all([fse.remove(configPath), fse.remove(dataPath)]);
    });

    describe('no config', () => {
        beforeAll(async () => {
            const module: TestingModule = await Test.createTestingModule({
                imports: [ConfigModule.forRoot({isGlobal: true}), SystemModule.register()],
            }).compile();

            provider = module.get(SystemProvider);
        });

        afterAll(() => provider.useEnvironment('test'));

        it('should be defined', () => {
            expect(provider).toBeDefined();
        });

        it('should create a new environment', async () => {
            // create new env (inactive)
            const additionalTestEnvConfig: IEnvironmentConfigInput = {
                name: 'new-test',
                type: ENVIRONMENT_TYPES.LOCAL,
            };
            newTestEnv = await provider.createEnvironment(additionalTestEnvConfig);

            // get the new environment by id
            const getEnv = await provider.getEnvironment(newTestEnv.id);
            expect(getEnv.id).toBe(newTestEnv.id);
            expect(getEnv.name).toBe(newTestEnv.name);
            expect(newTestEnv.isActive).toBe(false);
            expect(getEnv.isActive).toBe(newTestEnv.isActive);
        });

        it('should return active env if no parameter passed', async () => {
            // no param
            const defaultTestEnv = await provider.getEnvironment();
            expect(defaultTestEnv.name).toBe('test');
            expect(defaultTestEnv.isActive).toBe(true);
        });

        it('should return an environment if it exists', async () => {
            // nameOrId
            const idTestEnv = await provider.getEnvironment(newTestEnv?.id);
            expect(idTestEnv.id).toBe(newTestEnv?.id);
            expect(idTestEnv.name).toBe(newTestEnv?.name);
            expect(idTestEnv.isActive).toBe(false);
            expect(idTestEnv.isActive).toBe(newTestEnv?.isActive);
        });

        it('should show throw if an environment does not exist', async () => {
            const nonExistentEnvName = 'non-existent-env';
            await expect(provider.getEnvironment(nonExistentEnvName)).rejects.toThrow(
                new NotFoundError(`Environment "${nonExistentEnvName}" not found`),
            );
        });

        it('should throw if no active env and no nameOrId param passed', async () => {
            // make the new test env active
            await provider.useEnvironment(newTestEnv!.id);
            const newDefaultTestEnv = await provider.getEnvironment();
            expect(newDefaultTestEnv.name).toBe(newTestEnv?.name);
            expect(newDefaultTestEnv.isActive).toBe(true);

            // now set the new test env to inactive, so both envs are inactive
            await newDefaultTestEnv.updateConfig('active', false);

            // should throw an error
            await expect(provider.getEnvironment()).rejects.toThrow(
                new NotFoundError(`No environment in use`, [
                    'Run relate env:use <environment> first to set an active environment',
                ]),
            );
        });
    });

    describe('config', () => {
        beforeAll(async () => {
            const module: TestingModule = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({isGlobal: true}),
                    SystemModule.register({defaultEnvironmentNameOrId: newTestEnv?.id}),
                ],
            }).compile();

            provider = module.get(SystemProvider);
        });

        afterAll(() => provider.useEnvironment('test'));

        it('should be defined', () => {
            expect(provider).toBeDefined();
        });

        it('should get environment by nameOrId', async () => {
            // nameOrId
            const idTestEnv = await provider.getEnvironment(newTestEnv?.id);
            expect(idTestEnv.id).toBe(newTestEnv?.id);
            expect(idTestEnv.name).toBe(newTestEnv?.name);
            expect(idTestEnv.isActive).toBe(false);
            expect(idTestEnv.isActive).toBe(newTestEnv?.isActive);
        });

        it('should return config.defaultEnvironmentNameOrId if not param passed', async () => {
            // in this case, expect no param passed to also return newTestEnv
            const defaultTestEnv = await provider.getEnvironment();
            expect(defaultTestEnv.id).toBe(newTestEnv?.id);
            expect(defaultTestEnv.name).toBe(newTestEnv?.name);
            expect(defaultTestEnv.isActive).toBe(false);
            expect(defaultTestEnv.isActive).toBe(newTestEnv?.isActive);
        });

        it('should return active environment if search for by nameOrId', async () => {
            // existing default env should still exist
            const existingTestEnv = await provider.getEnvironment('test');
            expect(existingTestEnv.name).toBe('test');
            expect(existingTestEnv.isActive).toBe(true);
        });

        it('should return config.defaultEnvironmentNameOrId regardless of active/inactive', async () => {
            // make the new test env active
            await provider.useEnvironment(newTestEnv!.id);
            // now set the new test env to inactive, so both envs are inactive
            const newDefaultTestEnv = await provider.getEnvironment();
            await newDefaultTestEnv.updateConfig('active', false);

            // in this case expect no param to still return newTestEnv
            const currentDefaultTestEnv = await provider.getEnvironment();
            expect(currentDefaultTestEnv.id).toBe(newTestEnv?.id);
            expect(currentDefaultTestEnv.name).toBe(newTestEnv?.name);
            expect(currentDefaultTestEnv.isActive).toBe(false);
            expect(currentDefaultTestEnv.isActive).toBe(newTestEnv?.isActive);
        });
    });
});
