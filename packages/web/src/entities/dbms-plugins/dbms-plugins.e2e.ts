/* eslint-disable max-len */
import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {IDbmsPluginSource, NEO4J_PLUGIN_SOURCES_URL, TestDbmss} from '@relate/common';
import {ConfigModule} from '@nestjs/config';
import request from 'supertest';
import nock from 'nock';

import configuration from '../../configs/dev.config';
import {WebModule} from '../../web.module';

let TEST_DBMS_NAME: string;
let TEST_DBMS_ID: string;

const HTTP_OK = 200;

const queryBody = (query: string, variables?: {[key: string]: any}): {[key: string]: any} => ({
    query,
    variables: {
        dbmsName: TEST_DBMS_NAME,
        dbmsNames: [TEST_DBMS_NAME],
        dbmsId: TEST_DBMS_ID,
        dbmsIds: [TEST_DBMS_ID],
        environmentNameOrId: 'test',
        ...variables,
    },
});

const PLUGIN_SOURCES_ORIGIN = new URL(NEO4J_PLUGIN_SOURCES_URL).origin;
const PLUGIN_SOURCES_PATHNAME = new URL(NEO4J_PLUGIN_SOURCES_URL).pathname;

const APOC_SOURCE: IDbmsPluginSource = {
    name: 'apoc',
    homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
    versionsUrl: 'https://neo4j-contrib.github.io/neo4j-apoc-procedures/versions.json',
};

const TEST_SOURCE: IDbmsPluginSource = {
    name: 'test-plugin-1',
    homepageUrl: 'https://github.com/neo4j-contrib/test-plugin-1',
    versionsUrl: 'https://neo4j-contrib.github.io/test-plugin-1/versions.json',
};

describe('DBMSPluginsModule', () => {
    let app: INestApplication;
    let dbmss: TestDbmss;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        const {name, id} = await dbmss.createDbms();

        TEST_DBMS_NAME = name;
        TEST_DBMS_ID = id;

        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
                WebModule.register({
                    defaultEnvironmentNameOrId: dbmss.environment.id,
                    ...configuration(),
                }),
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(() => {
        dbmss.teardown();
        nock.cleanAll();
    });

    describe('dbms stopped', () => {
        test('/graphql listDbmsPlugins (initial)', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query ListDBMSPlugins($environmentNameOrId: String, $dbmsId: String!) {
                              listDbmsPlugins(environmentNameOrId: $environmentNameOrId, dbmsId: $dbmsId) {
                                name
                                homepageUrl
                                versionsUrl
                                version {
                                  version
                                }
                              }
                          }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {listDbmsPlugins} = res.body.data;
                    expect(listDbmsPlugins).toHaveLength(1);
                    expect(listDbmsPlugins).toEqual([
                        {
                            name: 'neo4j-jwt-addon',
                            homepageUrl: 'https://github.com/neo4j-devtools/relate',
                            version: {
                                version: '1.2.0',
                            },
                            versionsUrl:
                                'https://s3-eu-west-1.amazonaws.com/dist.neo4j.org/relate/neo4j-jwt-addon/versions.json',
                        },
                    ]);
                });
        });
    });

    test('/graphql installDbmsPlugin (plugin that exists)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `mutation InstallDBMSPlugin($environmentNameOrId: String, $dbmsIds: [String!]!, $pluginName: String!) {
                            installDbmsPlugin(environmentNameOrId: $environmentNameOrId, dbmsIds: $dbmsIds, pluginName: $pluginName) {
                                name
                          }
                      }`,
                    {
                        pluginName: 'apoc',
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect(async (res: request.Response) => {
                const {installDbmsPlugin} = res.body.data;
                expect(installDbmsPlugin).toHaveLength(1);
                expect(installDbmsPlugin).toEqual([
                    {
                        name: 'apoc',
                    },
                ]);
                const installedPlugins = await dbmss.environment.dbmsPlugins.list(TEST_DBMS_ID);
                expect(installedPlugins.mapEach((p) => ({name: p.name})).toArray()).toEqual([
                    {
                        name: 'apoc',
                    },
                    {
                        name: 'neo4j-jwt-addon',
                    },
                ]);
            });
    });

    test('/graphql uninstallDbmsPlugin', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `mutation UninstallDBMSPlugin($environmentNameOrId: String, $dbmsIds: [String!]!, $pluginName: String!) {
                            uninstallDbmsPlugin(environmentNameOrId: $environmentNameOrId, dbmsIds: $dbmsIds, pluginName: $pluginName) {
                                dbmsIds
                                pluginName
                            }
                      }`,
                    {
                        pluginName: 'apoc',
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect(async (res: request.Response) => {
                const {uninstallDbmsPlugin} = res.body.data;
                expect(uninstallDbmsPlugin.dbmsIds).toHaveLength(1);
                expect(uninstallDbmsPlugin.dbmsIds[0]).toBe(TEST_DBMS_ID);
                expect(uninstallDbmsPlugin.pluginName).toBe('apoc');
                const installedPlugins = await dbmss.environment.dbmsPlugins.list(TEST_DBMS_ID);
                expect(installedPlugins.mapEach((p) => ({name: p.name})).toArray()).toEqual([
                    {
                        name: 'neo4j-jwt-addon',
                    },
                ]);
            });
    });

    test('/graphql listDbmsPluginSources (initial)', () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .reply(200, {
                apoc: {
                    homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
                    versionsUrl: 'https://neo4j-contrib.github.io/neo4j-apoc-procedures/versions.json',
                },
            });
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query ListDBMSPluginSources($environmentNameOrId: String) {
                          listDbmsPluginSources(environmentNameOrId: $environmentNameOrId) {
                            name
                            homepageUrl
                            versionsUrl
                          }
                      }`,
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {listDbmsPluginSources} = res.body.data;
                expect(listDbmsPluginSources).toHaveLength(2);
                expect(listDbmsPluginSources).toEqual([
                    APOC_SOURCE,
                    {
                        name: 'neo4j-jwt-addon',
                        homepageUrl: 'https://github.com/neo4j-devtools/relate',
                        versionsUrl:
                            'https://s3-eu-west-1.amazonaws.com/dist.neo4j.org/relate/neo4j-jwt-addon/versions.json',
                    },
                ]);
            });
    });

    test('/graphql addDbmsPluginSources', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `mutation AddDBMSPluginSources($environmentNameOrId: String, $sources: [DbmsPluginSourceInput!]!) {
                        addDbmsPluginSources(environmentNameOrId: $environmentNameOrId, sources: $sources) {
                            name
                            homepageUrl
                            versionsUrl
                          }
                      }`,
                    {
                        sources: [TEST_SOURCE],
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {addDbmsPluginSources} = res.body.data;
                expect(addDbmsPluginSources).toHaveLength(1);
                expect(addDbmsPluginSources).toEqual([TEST_SOURCE]);
            });
    });

    test('/graphql removeDbmsPluginSources (unofficial)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `mutation RemoveDBMSPluginSources($environmentNameOrId: String, $names: [String!]!) {
                        removeDbmsPluginSources(environmentNameOrId: $environmentNameOrId, names: $names) {
                            name
                            homepageUrl
                            versionsUrl
                          }
                      }`,
                    {
                        names: [TEST_SOURCE.name],
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {removeDbmsPluginSources} = res.body.data;
                expect(removeDbmsPluginSources).toHaveLength(1);
                expect(removeDbmsPluginSources).toEqual([TEST_SOURCE]);
            });
    });
});
