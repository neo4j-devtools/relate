import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {Request, Response} from 'express';
import {HEALTH_BASE_ENDPOINT, SystemProvider, STATIC_APP_BASE_ENDPOINT} from '@relate/common';

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

    async register(httpAdapter: AbstractHttpAdapter): Promise<void> {
        if (!httpAdapter) {
            return;
        }

        const app = httpAdapter.getInstance();
        const environment = await this.systemProvider.getEnvironment();

        app.get(HEALTH_BASE_ENDPOINT, (_: Request, res: Response) =>
            res.json({
                relateEnvironmentId: environment.id,
                appRoot: STATIC_APP_BASE_ENDPOINT,
                pid: process.pid,
            }),
        );
    }
}
