import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import express from 'express';
import path from 'path';
import {EXTENSION_DIR_NAME, EXTENSION_TYPES, envPaths} from '@relate/common';

import {IWebModuleConfig} from '../../web.module';

@Injectable()
export class AppsService {
    constructor(@Inject(ConfigService) private readonly configService: ConfigService<IWebModuleConfig>) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app = httpAdapter.getInstance();
        const staticHTTPRoot = this.configService.get('staticHTTPRoot');
        const staticExts = path.join(envPaths().data, EXTENSION_DIR_NAME, EXTENSION_TYPES.STATIC);

        app.use(staticHTTPRoot, express.static(staticExts));
    }
}
