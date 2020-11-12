/* eslint-disable max-len */
import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import fse from 'fs-extra';
import path from 'path';
import {envPaths, PROJECTS_DIR_NAME, PROJECT_MANIFEST_FILE, TestDbmss} from '@relate/common';

import configuration from '../../configs/dev.config';
import {WebModule} from '../../web.module';

const HTTP_OK = 200;
let TEST_DB_ID: string;
const TEST_PROJECT_NAME = 'web-project';
const TEST_PROJECT_DBMS_NAME = 'web-project-dbms';
const TEST_PROJECT_DBMS_USER = 'neo4j';
const TEST_PROJECT_DBMS_OTHER_NAME = 'web-project-dbms-credentials';
const TEST_FILE_NAME = 'foo.txt';
const TEST_FILE_PATH = path.join(envPaths().tmp, TEST_FILE_NAME);
const TEST_ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6eyJzY2hlbWUiOiJiYXNpYyIsInByaW5jaXBhbCI6Im5lbzRqIiwiY3JlZGVudGlhbHMiOiJleUo0TldNaU9sc2lUVWxKUmtocVEwTkJkMkZuUVhkSlFrRm5TVU5GUVZGM1JGRlpTa3R2V2tsb2RtTk9RVkZGVEVKUlFYZFRSRVZNVFVGclIwRXhWVVZDYUUxRFZUQlZlRVI2UVU1Q1owNVdRa0ZuVFVKc1RqTmFWMUpzWW1wRlUwMUNRVWRCTVZWRlEyZDNTbFJ0Vm5aT1IyOW5VMWMxYWsxU1VYZEZaMWxFVmxGUlJFUkJkRTlhVnpnd1lXbENTbUp1VW14amFrRmxSbmN3ZVUxRVFYbE5hbFYzVDBSQmQwNUVRbUZHZHpCNlRVUkJlVTFxU1hkUFJFRjNUa1JDWVUxR1JYaERla0ZLUW1kT1ZrSkJXVlJCYkU1R1RWRTRkMFJSV1VSV1VWRkpSRUZhVkdReVZtdGFWelI0UldwQlVVSm5UbFpDUVc5TlExVTFiR0o2VW5GSlJXeDFXWHBGWkUxQ2MwZEJNVlZGUVhkM1ZWUnRWblpPUjI5blVUSldlV1JEUWxkWlYzaHdXa2RHTUdJelNYZG5aMFZwVFVFd1IwTlRjVWRUU1dJelJGRkZRa0ZSVlVGQk5FbENSSGRCZDJkblJVdEJiMGxDUVZGRFhDOVFNMFppU0ZNNVNXOUllV3RjTDNSVk5sZ3liME5SZEVKTFMweElkbHBrZG5oTFpUVkZNbHBRVkZsTlYyWTRSMnRQVDB4Sk5FSjRUMHR2Wmt4UFRGbzVaVGRMTWxaaGNsa3pObkpHZVhKYWJrVmNMMXd2WjNjclVYbHlRVUpCUkRGaFlUVnlWRzVyYjB0NWNHdzBWM2x3ZVU5VGFGWkplbTlXVWswek1FY3diREJIVVhVcmRHaFlUMDVYTW01QlQwWlRWMjlZVm1ZMVJXSkVUMkZ3YWt0b2EwZFlUSFkzUkV4M2NIcFFPREV5ZDFaVFZUQTVkbVZJWkdScE1tdFNWVlpZYURkc05HRk9aRW9yZDI5NGJWZFBUbWcyVmpCUE1rRnFTMk5xTkd4UWEzTmlPWGx3Tmx3dldYZENNbkk1ZFhsYWJHMUlTMmxGUm5OVk1XVllXWGQxU0U5R01XdE9iVk5qWkZScWRIbFpkMUJjTDB4dlhDOUhkakI1T1VSbU5EWnZlSE52ZEhCb1drNTNRMHhSWkdkVVFXWkRkR2hrYkZvemFEUmFaVTlqYUhKelVqSklhMlpjTDBSRVZtVkJkWGRTWWxJeWVqSkdaaXRuTVVGblRVSkJRVWRxWjJkRlNFMUpTVUpCZWtGS1FtZE9Wa2hTVFVWQmFrRkJUVUpGUjBOWFEwZFRRVWRISzBWSlFrRlJVVVZCZDBsR2IwUkJla0puYkdkb2EyZENhSFpvUTBGUk1FVkthRmxyVkROQ2JHSnNUbFJVUTBKSVdsYzFiR050UmpCYVYxRm5VVEo0Y0ZwWE5UQkpSVTVzWTI1U2NGcHRiR3BaV0ZKc1RVSXdSMEV4VldSRVoxRlhRa0pTUTNKMWVHbFJiVTVNU1VJNGJXRkRlVXBsWlZCclpHTjRlbXRVUVdaQ1owNVdTRk5OUlVkRVFWZG5RbFI2Y0RReWFtd3pNR3RDVFhoQ1IweHZPV0kxVGxSaWVDdElOa1JCVDBKblRsWklVVGhDUVdZNFJVSkJUVU5DWlVGM1NGRlpSRlpTTUd4Q1FsbDNSa0ZaU1V0M1dVSkNVVlZJUVhkSlIwTkRjMGRCVVZWR1FuZE5SVTFFT0VkQk1WVmtTSGRSTkUxRVdYZE9TMEY1YjBSRFIweHRhREJrU0VFMlRIazVjMkl5VG1oaVIyaDJZek5STms1cVFYZE5RemxxWTIxM2RtRlhOVEJhV0VwMFdsZFNjRmxZVW14TWJVNTVZa00xZDFwWE1IZEVVVmxLUzI5YVNXaDJZMDVCVVVWTVFsRkJSR2RuU1VKQlJIWjZTbXhyUWpGWFpucFNTRmRQZUhOUmVFNU1VRzFhVkZadFFsZzVUREJtYldaVU4xQkNibkJLZUhoV1dsUkhaR016YWxkamQyOUpURGhIVkU5bk9XaDFjRnBSTlhscVJ6ZFhhMW8xYjI4NE5XUmtRMmt6Ukc4eFYxQllZMnRCTkZFd2VVTlFOVFJpYjNaY0wzbGFiakJOVURjd1p6ZzJaM04yYlVONFkxa3hWV2hGUTJoVmQxd3ZUV2gwU0ZGTWFFbERia0pwVGtWRVFuWTRSWFpsUjB3M2FWTklSMXBvWEM5NlpHVlliVWxzY0c5MGVUa3JOMkpRU2paS1RuTlZUWFUwT0ROVFZGZFJjbVJTYmxSaFZXOXlRbmRzUkU5Q2ExVmxkWEJjTHpCb1NtdERPR3g0VEcwNFZuaDZhbWh0VEc0MU4xQlFXVzVQVFdOUlVYTklSRFF3VWpSYVozUnJObmxzUzIweFVXSjFNbWwzVGpJd1pHSTJaRmNyUTNGSVpVUndSemxZU0hWVVhDOXpiRVJFTjBOblZIVktZVkZhVlVkSk1XRjBWa2MwUm5CSWRrRXdlbWs0TWxwV1RsUnRNM0ZsVG1FemFFMW9iemhFWkRoVlZrVmFOalJYVVZVME5HRlBiMXd2ZFVwSllrMTZRV2NyT0ZSUFlsWjFhRXRvYTFKMGRreG9UMW8yUjBZeVpUVmtLM2xHZFhGMVQyRjVVbEZKTTA4d1NrWjRibE5VWWtSRGJWaFNPVlYwT0U1UloyeGpTVzVOUW5OYVMzUldhSGxKUlU5MFpWWnNZM1ZVZVhwSFlVOUljR1pjTDJoQk0wbEtaMWg1YW01RVZIcFZTbFJJUmxkM1kzRm9kamN3VDFCa1ZVcG5NRmRrZDFaRVRUUjZNR3h0YTJKbVMwZEJORlp3YW1kU2NYUnBZVGR4VTJsMWN6VlJPRFJtZFZORVFUZFNPVEJJYjBaY0wxaENSSFZYV1hsemNteE1TMXd2Y2tSS1kwZEtVbE5rYTJ0eU1tZG1lV0YxU2x3dmR6QnpaRGw1WlhKb1NrcE9TemNyZVhSelQxbGNMM1Z6VVRkak16Wm9Ra2N4WjNWQ00yNU9SMU5IUlhVeGVreGxkRUZWZHpWdVdXUkZSRFZHYnpaYWMzWjFUSFJGUkRoQlZVZFlaRVp4U1V4WldUTkxXSFpEUm14UlFuRjJRM2hpZEhreWNEZzJTMFZrZFZWbUt5SmRMQ0owZVhBaU9pSktWMVFpTENKaGJHY2lPaUpTVXpVeE1pSjkuZXlKaGRXUWlPaUppYkc5dmJTSXNJbTVpWmlJNk1UVTROVGd6TWpreE1pd2ljMk52Y0dVaU9sc2lZV1J0YVc0aVhTd2lhWE56SWpvaWJtVnZOR29pTENKbWJHRm5jeUk2VzEwc0ltVjRjQ0k2TVRVNE9EUXlORGt4TWl3aWFXRjBJam94TlRnMU9ETXlPVEV5TENKcWRHa2lPaUl6VGxsM2JtczBlaUlzSW5WelpYSnVZVzFsSWpvaWJtVnZOR29pZlEuU0RqSEItWXI1a3JROVJvdmxsaGtIM1kycVJQMzlOQy1kanZfYzdna0x1UXpKcmVueDY5RVY5MUxxYThUYnM0V0NjWDNFU2Q0MW1wUkdvbXVjR01LY0lON190Qm03SE5weXBVam03MlJaWHAyWlM5b0hTb1V4WndVekg3OFVvbHdJUHFuLXd5Vk9iWmxBRURzNnBfYmdSOGpNc1Z4X1g1bnhhT0FmLVVUY2J5WGVGOVgxbkVXMFd1TnN3T0N0WjZpZm9qSi1xbzRkWEI3eGNiMWQ1MnptVDFvZGZQdzBPXzRoTFNTZU81NWIwZ3g4OXZTMmJBUWYtNmpFSEZ0eVlJeFA1b05kWUZQa20yUkVlYkI2elZTWWV2ZzI5dDBOYzJRYUlxSVhtcU04OTNGRS1CeWQ2NlUwalphM2F5WmdQZXNBMll6dG85ZFRaNVhBY2FRR1pwMkJRIn0sImFjY291bnRJZCI6ImZvbyIsImFwcElkIjoiYmxvb20iLCJkYm1zSWQiOiJib20iLCJpYXQiOjE1ODU4MzMwODEsImV4cCI6MTU4NTkxOTQ4MX0.72dX69CwV9KJHZA9kz2n1ruwSx7znvM7uJjmvLZAF8w';

describe('AppsModule', () => {
    let app: INestApplication;
    let dbmss: TestDbmss;

    const queryBody = (query: string, variables?: {[key: string]: any}): {[key: string]: any} => ({
        query,
        variables: {
            environmentNameOrId: dbmss.environment.id,
            ...variables,
        },
    });

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        const {id} = await dbmss.createDbms();
        TEST_DB_ID = id;

        await fse.ensureFile(TEST_FILE_PATH);

        const module = await Test.createTestingModule({
            imports: [
                WebModule.register({
                    defaultEnvironmentNameOrId: dbmss.environment.id,
                    ...configuration(),
                }),
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await fse.remove(path.join(envPaths().data, PROJECTS_DIR_NAME, TEST_PROJECT_NAME));
        await dbmss.teardown();
    });

    test('/graphql listProjects (none created)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query list($environmentNameOrId: String) {
                            listProjects(environmentNameOrId: $environmentNameOrId) {
                                name
                            }
                        }
                    `,
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {listProjects} = res.body.data;
                const expected: any = {name: TEST_PROJECT_NAME};

                expect(listProjects).not.toContainEqual(expected);
            });
    });

    test('/graphql getProject (none created)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query get($environmentNameOrId: String, $name: String!) {
                            getProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const [{message}] = res.body.errors;
                const expected = `Could not find project ${TEST_PROJECT_NAME}`;

                expect(message).toEqual(expected);
            });
    });

    test('/graphql initProject', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        mutation init($environmentNameOrId: String, $name: String!) {
                            initProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {initProject} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_NAME,
                };

                expect(initProject).toEqual(expected);
            });
    });

    test('/graphql getProject (when created)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query get($environmentNameOrId: String, $name: String!) {
                            getProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {getProject} = res.body.data;
                const expected = {name: TEST_PROJECT_NAME};

                expect(getProject).toEqual(expected);
            });
    });

    test('/graphql initProject (duplicate)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        mutation init($environmentNameOrId: String, $name: String!) {
                            initProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const [{message}] = res.body.errors;
                const expected = `Project ${TEST_PROJECT_NAME} already exists`;

                expect(message).toEqual(expected);
            });
    });

    test('/graphql listProjects (when created)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query list($environmentNameOrId: String) {
                            listProjects(environmentNameOrId: $environmentNameOrId) {
                                name
                            }
                        }
                    `,
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {listProjects} = res.body.data;
                const expected: any = {name: TEST_PROJECT_NAME};

                expect(listProjects).toContainEqual(expected);
            });
    });

    test('/graphql listProjectDbmss (none created)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query list($environmentNameOrId: String, $name: String!) {
                            getProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                                dbmss {
                                    name
                                }
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {getProject} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_NAME,
                    dbmss: [],
                };

                expect(getProject).toEqual(expected);
            });
    });

    test('/graphql addProjectDbms (no credentials)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        mutation dbms($environmentNameOrId: String, $dbmsName: String!, $name: String!, $dbmsId: String!) {
                            addProjectDbms(environmentNameOrId: $environmentNameOrId, name: $name, dbmsName: $dbmsName, dbmsId: $dbmsId) {
                                name
                            }
                        }
                    `,
                    {
                        name: TEST_PROJECT_NAME,
                        dbmsName: TEST_PROJECT_DBMS_NAME,
                        dbmsId: TEST_DB_ID,
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {addProjectDbms} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_DBMS_NAME,
                };

                expect(addProjectDbms).toEqual(expected);
            });
    });

    test('/graphql addProjectDbms (duplicate)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        mutation dbms($environmentNameOrId: String, $dbmsName: String!, $name: String!, $dbmsId: String!) {
                            addProjectDbms(environmentNameOrId: $environmentNameOrId, name: $name, dbmsName: $dbmsName, dbmsId: $dbmsId) {
                                name
                            }
                        }
                    `,
                    {
                        name: TEST_PROJECT_NAME,
                        dbmsName: TEST_PROJECT_DBMS_NAME,
                        dbmsId: TEST_DB_ID,
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const [{message}] = res.body.errors;
                const expected = `Dbms "${TEST_PROJECT_DBMS_NAME}" already exists in project`;

                expect(message).toEqual(expected);
            });
    });

    test('/graphql listProjectDbmss (when created)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query get($environmentNameOrId: String, $name: String!) {
                            getProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                                dbmss {
                                    name
                                }
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {getProject} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_NAME,
                    dbmss: [{name: TEST_PROJECT_DBMS_NAME}],
                };

                expect(getProject).toEqual(expected);
            });
    });

    test('/graphql removeProjectDbms', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        mutation dbms($environmentNameOrId: String, $dbmsName: String!, $name: String!) {
                            removeProjectDbms(environmentNameOrId: $environmentNameOrId, name: $name, dbmsName: $dbmsName) {
                                name
                            }
                        }
                    `,
                    {
                        name: TEST_PROJECT_NAME,
                        dbmsName: TEST_PROJECT_DBMS_NAME,
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {removeProjectDbms} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_DBMS_NAME,
                };

                expect(removeProjectDbms).toEqual(expected);
            });
    });

    test('/graphql removeProjectDbms (duplicate)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        mutation dbms($environmentNameOrId: String, $dbmsName: String!, $name: String!) {
                            removeProjectDbms(environmentNameOrId: $environmentNameOrId, name: $name, dbmsName: $dbmsName) {
                                name
                            }
                        }
                    `,
                    {
                        name: TEST_PROJECT_NAME,
                        dbmsName: TEST_PROJECT_DBMS_NAME,
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const [{message}] = res.body.errors;
                const expected = `Dbms "${TEST_PROJECT_DBMS_NAME}" not found`;

                expect(message).toEqual(expected);
            });
    });

    test('/graphql listProjectDbmss (when removed)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query get($environmentNameOrId: String, $name: String!) {
                            getProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                                dbmss {
                                    name
                                }
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {getProject} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_NAME,
                    dbmss: [],
                };

                expect(getProject).toEqual(expected);
            });
    });

    test('/graphql addProjectDbms (with credentials)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        mutation dbms($environmentNameOrId: String, $dbmsName: String!, $name: String!, $dbmsId: String!, $user: String, $accessToken: String) {
                            addProjectDbms(environmentNameOrId: $environmentNameOrId, name: $name, dbmsName: $dbmsName, dbmsId: $dbmsId, user: $user, accessToken: $accessToken) {
                                name
                                user
                                accessToken
                            }
                        }
                    `,
                    {
                        accessToken: TEST_ACCESS_TOKEN,
                        dbmsId: TEST_DB_ID,
                        dbmsName: TEST_PROJECT_DBMS_OTHER_NAME,
                        name: TEST_PROJECT_NAME,
                        user: TEST_PROJECT_DBMS_USER,
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {addProjectDbms} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_DBMS_OTHER_NAME,
                    user: TEST_PROJECT_DBMS_USER,
                    accessToken: TEST_ACCESS_TOKEN,
                };

                expect(addProjectDbms).toEqual(expected);
            });
    });

    test('/graphql listProjectDbmss (when credentials created)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query get($environmentNameOrId: String, $name: String!) {
                            getProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                                dbmss {
                                    name
                                    accessToken
                                }
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {getProject} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_NAME,
                    dbmss: [
                        {
                            name: TEST_PROJECT_DBMS_OTHER_NAME,
                            accessToken: TEST_ACCESS_TOKEN,
                        },
                    ],
                };

                expect(getProject).toEqual(expected);
            });
    });

    test('/graphql removeProjectDbms (credentials)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        mutation dbms($environmentNameOrId: String, $dbmsName: String!, $name: String!) {
                            removeProjectDbms(environmentNameOrId: $environmentNameOrId, name: $name, dbmsName: $dbmsName) {
                                name
                                accessToken
                            }
                        }
                    `,
                    {
                        name: TEST_PROJECT_NAME,
                        dbmsName: TEST_PROJECT_DBMS_OTHER_NAME,
                    },
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {removeProjectDbms} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_DBMS_OTHER_NAME,
                    accessToken: TEST_ACCESS_TOKEN,
                };

                expect(removeProjectDbms).toEqual(expected);
            });
    });

    test('/graphql listProjectDbmss (when removed again)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query get($environmentNameOrId: String, $name: String!) {
                            getProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                                dbmss {
                                    name
                                }
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {getProject} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_NAME,
                    dbmss: [],
                };

                expect(getProject).toEqual(expected);
            });
    });

    test('/graphql listProjectFiles (none created)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `
                        query list($environmentNameOrId: String, $name: String!) {
                            getProject(environmentNameOrId: $environmentNameOrId, name: $name) {
                                name
                                files {
                                    name
                                }
                            }
                        }
                    `,
                    {name: TEST_PROJECT_NAME},
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {getProject} = res.body.data;
                const expected = {
                    name: TEST_PROJECT_NAME,
                    files: [{name: PROJECT_MANIFEST_FILE}],
                };

                expect(getProject).toEqual(expected);
            });
    });
});
