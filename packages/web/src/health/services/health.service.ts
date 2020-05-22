import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {Request, Response} from 'express';

import {IWebModuleConfig} from '../../web.module';

export interface IHealthInfo {
    appRoot: string;
    pid: number;
}

@Injectable()
export class HealthService {
    get healthUrl(): string {
        const protocol = this.configService.get('protocol');
        const host = this.configService.get('host');
        const port = this.configService.get('port');
        const healthCheckEndpoint = this.configService.get('healthCheckEndpoint');

        return `${protocol}${host}:${port}${healthCheckEndpoint}`;
    }

    constructor(@Inject(ConfigService) private readonly configService: ConfigService<IWebModuleConfig>) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app = httpAdapter.getInstance();
        const healthCheckEndpoint = this.configService.get('healthCheckEndpoint');

        app.get(healthCheckEndpoint, (_: Request, res: Response) =>
            res.json({
                appRoot: this.configService.get('appRoot'),
                pid: process.pid,
            }),
        );
    }
}
