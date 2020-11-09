import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import express from 'express';
import path from 'path';
import {EXTENSION_DIR_NAME, EXTENSION_TYPES, STATIC_APP_BASE_ENDPOINT, SystemProvider} from '@relate/common';

@Injectable()
export class AppsService {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    async register(httpAdapter: AbstractHttpAdapter): Promise<void> {
        if (!httpAdapter) {
            return;
        }

        const app = httpAdapter.getInstance();
        const environment = await this.systemProvider.getEnvironment();
        const installedApps = path.join(environment.dataPath, EXTENSION_DIR_NAME, EXTENSION_TYPES.STATIC);

        app.use(STATIC_APP_BASE_ENDPOINT, express.static(installedApps));
    }
}
