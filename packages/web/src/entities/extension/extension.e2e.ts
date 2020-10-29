import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {ConfigModule} from '@nestjs/config';
import request from 'supertest';
import {
    Environment,
    TestDbmss,
    TestExtensions,
    IInstalledExtension,
    STATIC_APP_BASE_ENDPOINT,
    envPaths,
    PROJECTS_DIR_NAME,
    getAppLaunchUrl,
} from '@relate/common';
import fse from 'fs-extra';
import path from 'path';

import configuration from '../../configs/dev.config';
import {WebModule} from '../../web.module';

let TEST_DB_ID: string;
const TEST_ACCESS_TOKEN =
    // eslint-disable-next-line max-len
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6eyJzY2hlbWUiOiJiYXNpYyIsInByaW5jaXBhbCI6Im5lbzRqIiwiY3JlZGVudGlhbHMiOiJleUo0TldNaU9sc2lUVWxKUmtocVEwTkJkMkZuUVhkSlFrRm5TVU5GUVZGM1JGRlpTa3R2V2tsb2RtTk9RVkZGVEVKUlFYZFRSRVZNVFVGclIwRXhWVVZDYUUxRFZUQlZlRVI2UVU1Q1owNVdRa0ZuVFVKc1RqTmFWMUpzWW1wRlUwMUNRVWRCTVZWRlEyZDNTbFJ0Vm5aT1IyOW5VMWMxYWsxU1VYZEZaMWxFVmxGUlJFUkJkRTlhVnpnd1lXbENTbUp1VW14amFrRmxSbmN3ZVUxRVFYbE5hbFYzVDBSQmQwNUVRbUZHZHpCNlRVUkJlVTFxU1hkUFJFRjNUa1JDWVUxR1JYaERla0ZLUW1kT1ZrSkJXVlJCYkU1R1RWRTRkMFJSV1VSV1VWRkpSRUZhVkdReVZtdGFWelI0UldwQlVVSm5UbFpDUVc5TlExVTFiR0o2VW5GSlJXeDFXWHBGWkUxQ2MwZEJNVlZGUVhkM1ZWUnRWblpPUjI5blVUSldlV1JEUWxkWlYzaHdXa2RHTUdJelNYZG5aMFZwVFVFd1IwTlRjVWRUU1dJelJGRkZRa0ZSVlVGQk5FbENSSGRCZDJkblJVdEJiMGxDUVZGRFhDOVFNMFppU0ZNNVNXOUllV3RjTDNSVk5sZ3liME5SZEVKTFMweElkbHBrZG5oTFpUVkZNbHBRVkZsTlYyWTRSMnRQVDB4Sk5FSjRUMHR2Wmt4UFRGbzVaVGRMTWxaaGNsa3pObkpHZVhKYWJrVmNMMXd2WjNjclVYbHlRVUpCUkRGaFlUVnlWRzVyYjB0NWNHdzBWM2x3ZVU5VGFGWkplbTlXVWswek1FY3diREJIVVhVcmRHaFlUMDVYTW01QlQwWlRWMjlZVm1ZMVJXSkVUMkZ3YWt0b2EwZFlUSFkzUkV4M2NIcFFPREV5ZDFaVFZUQTVkbVZJWkdScE1tdFNWVlpZYURkc05HRk9aRW9yZDI5NGJWZFBUbWcyVmpCUE1rRnFTMk5xTkd4UWEzTmlPWGx3Tmx3dldYZENNbkk1ZFhsYWJHMUlTMmxGUm5OVk1XVllXWGQxU0U5R01XdE9iVk5qWkZScWRIbFpkMUJjTDB4dlhDOUhkakI1T1VSbU5EWnZlSE52ZEhCb1drNTNRMHhSWkdkVVFXWkRkR2hrYkZvemFEUmFaVTlqYUhKelVqSklhMlpjTDBSRVZtVkJkWGRTWWxJeWVqSkdaaXRuTVVGblRVSkJRVWRxWjJkRlNFMUpTVUpCZWtGS1FtZE9Wa2hTVFVWQmFrRkJUVUpGUjBOWFEwZFRRVWRISzBWSlFrRlJVVVZCZDBsR2IwUkJla0puYkdkb2EyZENhSFpvUTBGUk1FVkthRmxyVkROQ2JHSnNUbFJVUTBKSVdsYzFiR050UmpCYVYxRm5VVEo0Y0ZwWE5UQkpSVTVzWTI1U2NGcHRiR3BaV0ZKc1RVSXdSMEV4VldSRVoxRlhRa0pTUTNKMWVHbFJiVTVNU1VJNGJXRkRlVXBsWlZCclpHTjRlbXRVUVdaQ1owNVdTRk5OUlVkRVFWZG5RbFI2Y0RReWFtd3pNR3RDVFhoQ1IweHZPV0kxVGxSaWVDdElOa1JCVDBKblRsWklVVGhDUVdZNFJVSkJUVU5DWlVGM1NGRlpSRlpTTUd4Q1FsbDNSa0ZaU1V0M1dVSkNVVlZJUVhkSlIwTkRjMGRCVVZWR1FuZE5SVTFFT0VkQk1WVmtTSGRSTkUxRVdYZE9TMEY1YjBSRFIweHRhREJrU0VFMlRIazVjMkl5VG1oaVIyaDJZek5STms1cVFYZE5RemxxWTIxM2RtRlhOVEJhV0VwMFdsZFNjRmxZVW14TWJVNTVZa00xZDFwWE1IZEVVVmxLUzI5YVNXaDJZMDVCVVVWTVFsRkJSR2RuU1VKQlJIWjZTbXhyUWpGWFpucFNTRmRQZUhOUmVFNU1VRzFhVkZadFFsZzVUREJtYldaVU4xQkNibkJLZUhoV1dsUkhaR016YWxkamQyOUpURGhIVkU5bk9XaDFjRnBSTlhscVJ6ZFhhMW8xYjI4NE5XUmtRMmt6Ukc4eFYxQllZMnRCTkZFd2VVTlFOVFJpYjNaY0wzbGFiakJOVURjd1p6ZzJaM04yYlVONFkxa3hWV2hGUTJoVmQxd3ZUV2gwU0ZGTWFFbERia0pwVGtWRVFuWTRSWFpsUjB3M2FWTklSMXBvWEM5NlpHVlliVWxzY0c5MGVUa3JOMkpRU2paS1RuTlZUWFUwT0ROVFZGZFJjbVJTYmxSaFZXOXlRbmRzUkU5Q2ExVmxkWEJjTHpCb1NtdERPR3g0VEcwNFZuaDZhbWh0VEc0MU4xQlFXVzVQVFdOUlVYTklSRFF3VWpSYVozUnJObmxzUzIweFVXSjFNbWwzVGpJd1pHSTJaRmNyUTNGSVpVUndSemxZU0hWVVhDOXpiRVJFTjBOblZIVktZVkZhVlVkSk1XRjBWa2MwUm5CSWRrRXdlbWs0TWxwV1RsUnRNM0ZsVG1FemFFMW9iemhFWkRoVlZrVmFOalJYVVZVME5HRlBiMXd2ZFVwSllrMTZRV2NyT0ZSUFlsWjFhRXRvYTFKMGRreG9UMW8yUjBZeVpUVmtLM2xHZFhGMVQyRjVVbEZKTTA4d1NrWjRibE5VWWtSRGJWaFNPVlYwT0U1UloyeGpTVzVOUW5OYVMzUldhSGxKUlU5MFpWWnNZM1ZVZVhwSFlVOUljR1pjTDJoQk0wbEtaMWg1YW01RVZIcFZTbFJJUmxkM1kzRm9kamN3VDFCa1ZVcG5NRmRrZDFaRVRUUjZNR3h0YTJKbVMwZEJORlp3YW1kU2NYUnBZVGR4VTJsMWN6VlJPRFJtZFZORVFUZFNPVEJJYjBaY0wxaENSSFZYV1hsemNteE1TMXd2Y2tSS1kwZEtVbE5rYTJ0eU1tZG1lV0YxU2x3dmR6QnpaRGw1WlhKb1NrcE9TemNyZVhSelQxbGNMM1Z6VVRkak16Wm9Ra2N4WjNWQ00yNU9SMU5IUlhVeGVreGxkRUZWZHpWdVdXUkZSRFZHYnpaYWMzWjFUSFJGUkRoQlZVZFlaRVp4U1V4WldUTkxXSFpEUm14UlFuRjJRM2hpZEhreWNEZzJTMFZrZFZWbUt5SmRMQ0owZVhBaU9pSktWMVFpTENKaGJHY2lPaUpTVXpVeE1pSjkuZXlKaGRXUWlPaUppYkc5dmJTSXNJbTVpWmlJNk1UVTROVGd6TWpreE1pd2ljMk52Y0dVaU9sc2lZV1J0YVc0aVhTd2lhWE56SWpvaWJtVnZOR29pTENKbWJHRm5jeUk2VzEwc0ltVjRjQ0k2TVRVNE9EUXlORGt4TWl3aWFXRjBJam94TlRnMU9ETXlPVEV5TENKcWRHa2lPaUl6VGxsM2JtczBlaUlzSW5WelpYSnVZVzFsSWpvaWJtVnZOR29pZlEuU0RqSEItWXI1a3JROVJvdmxsaGtIM1kycVJQMzlOQy1kanZfYzdna0x1UXpKcmVueDY5RVY5MUxxYThUYnM0V0NjWDNFU2Q0MW1wUkdvbXVjR01LY0lON190Qm03SE5weXBVam03MlJaWHAyWlM5b0hTb1V4WndVekg3OFVvbHdJUHFuLXd5Vk9iWmxBRURzNnBfYmdSOGpNc1Z4X1g1bnhhT0FmLVVUY2J5WGVGOVgxbkVXMFd1TnN3T0N0WjZpZm9qSi1xbzRkWEI3eGNiMWQ1MnptVDFvZGZQdzBPXzRoTFNTZU81NWIwZ3g4OXZTMmJBUWYtNmpFSEZ0eVlJeFA1b05kWUZQa20yUkVlYkI2elZTWWV2ZzI5dDBOYzJRYUlxSVhtcU04OTNGRS1CeWQ2NlUwalphM2F5WmdQZXNBMll6dG85ZFRaNVhBY2FRR1pwMkJRIn0sImFjY291bnRJZCI6ImZvbyIsImFwcElkIjoiYmxvb20iLCJkYm1zSWQiOiJib20iLCJpYXQiOjE1ODU4MzMwODEsImV4cCI6MTU4NTkxOTQ4MX0.72dX69CwV9KJHZA9kz2n1ruwSx7znvM7uJjmvLZAF8w';
const TEST_PROJECT_ID = 'test_project_id';

const CREATE_APP_LAUNCH_TOKEN = {
    query: `
        mutation CreateAppLaunchToken(
            $environmentNameOrId: String,
            $dbmsId: String!,
            $appName: String!,
            $principal: String!,
            $accessToken: String!,
            $projectId: String!,
        ) {
            createAppLaunchToken(
                environmentNameOrId: $environmentNameOrId,
                dbmsId: $dbmsId,
                appName: $appName,
                principal: $principal,
                accessToken: $accessToken,
                projectId: $projectId,
            ) {
                token
                url
            }
        }
    `,
    variables: {
        accessToken: TEST_ACCESS_TOKEN,
        environmentNameOrId: 'test',
        principal: 'bam',
        // dbmsId: 'bar', // added in test
    },
};

const APP_LAUNCH_DATA = {
    query: `
        query appLaunchData($appName: String!, $launchToken: String!) {
            appLaunchData(appName: $appName, launchToken: $launchToken) {
                environmentId
                appName
                dbms {
                    id
                }
                principal
                accessToken
                project {
                    name
                }
            }
        }
    `,
    variables: {
        environmentNameOrId: 'test',
        // launchToken: "" // added in test
    },
};
const HTTP_OK = 200;
const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;

describe('AppsModule', () => {
    let app: INestApplication;
    let dbmss: TestDbmss;
    const extensions = new TestExtensions(__filename);
    let testExtension: IInstalledExtension;
    let testEnvironment: Environment;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        const {id} = await dbmss.createDbms();
        testEnvironment = dbmss.environment;
        TEST_DB_ID = id;
        testExtension = await extensions.installNew();

        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
                WebModule,
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await dbmss.teardown();
        await extensions.teardown();
        await fse.remove(path.join(envPaths().data, PROJECTS_DIR_NAME, TEST_PROJECT_ID));
    });

    test('/graphql createAppLaunchToken', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                ...CREATE_APP_LAUNCH_TOKEN,
                variables: {
                    ...CREATE_APP_LAUNCH_TOKEN.variables,
                    accessToken: TEST_ACCESS_TOKEN,
                    dbmsId: TEST_DB_ID,
                    appName: testExtension.name,
                    projectId: TEST_PROJECT_ID,
                },
            })
            .expect(HTTP_OK)
            .expect(async (res: request.Response) => {
                const {createAppLaunchToken = {}} = res.body.data;
                const {token, url: tokenPath} = createAppLaunchToken;
                const appUrl = `${testEnvironment.httpOrigin}${STATIC_APP_BASE_ENDPOINT}/${testExtension.name}/`;
                const expectedPath = await getAppLaunchUrl(testEnvironment, appUrl, testExtension.name, token);

                expect(token).toEqual(expect.stringMatching(JWT_REGEX));
                expect(tokenPath).toEqual(expectedPath);
            });
    });

    test('/graphql appLaunchData', async () => {
        const {principal} = CREATE_APP_LAUNCH_TOKEN.variables;
        const launchToken = await testEnvironment.extensions.createAppLaunchToken(
            testExtension.name,
            TEST_DB_ID,
            principal,
            TEST_ACCESS_TOKEN,
            TEST_PROJECT_ID,
        );
        const {name: projectName} = await testEnvironment.projects.create({
            name: TEST_PROJECT_ID,
            dbmss: [],
        });

        return (
            request(app.getHttpServer())
                .post('/graphql')
                .send({
                    ...APP_LAUNCH_DATA,
                    variables: {
                        ...APP_LAUNCH_DATA.variables,
                        appName: testExtension.name,
                        launchToken,
                    },
                })
                // .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {appLaunchData = {}} = res.body.data;

                    expect(appLaunchData).toEqual({
                        accessToken: CREATE_APP_LAUNCH_TOKEN.variables.accessToken,
                        appName: testExtension.name,
                        dbms: {
                            id: TEST_DB_ID,
                        },
                        environmentId: expect.any(String),
                        principal: CREATE_APP_LAUNCH_TOKEN.variables.principal,
                        project: {
                            name: projectName,
                        },
                    });
                })
        );
    });
});
