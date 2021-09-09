import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {Request, Response} from 'express';
import {HEALTH_BASE_ENDPOINT, SystemProvider, STATIC_APP_BASE_ENDPOINT, ConfigService} from '@relate/common';

import {IWebModuleConfig} from '../../web.module';

export interface IHealthInfo {
    relateEnvironmentId: string;
    appRoot: string;
    pid: number;
}

@Injectable()
export class HealthService {
    get healthUrl(): string {
        const protocol = this.configService.get('protocol');
        const host = this.configService.get('host');
        const port = this.configService.get('port');

        return `${protocol}${host}:${port}${HEALTH_BASE_ENDPOINT}`;
    }

    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService<IWebModuleConfig>,
        @Inject(SystemProvider) private readonly systemProvider: SystemProvider,
    ) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app = httpAdapter.getInstance();

        app.get(HEALTH_BASE_ENDPOINT, async (_: Request, res: Response) => {
            const environment = await this.systemProvider.getEnvironment();

            res.json({
                relateEnvironmentId: environment.id,
                appRoot: STATIC_APP_BASE_ENDPOINT,
                pid: process.pid,
            });
        });
    }
}
