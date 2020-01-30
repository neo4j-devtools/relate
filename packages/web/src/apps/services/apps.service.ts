import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import express from 'express';

import {IWebModuleConfig} from '../../web.module';

@Injectable()
export class AppsService {
    constructor(@Inject(ConfigService) private readonly configService: ConfigService<IWebModuleConfig>) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app = httpAdapter.getInstance();
        const staticFileRoot = this.configService.get('staticFileRoot');
        const staticHTTPRoot = this.configService.get('staticHTTPRoot');

        app.use(staticHTTPRoot, express.static(staticFileRoot));
    }
}
