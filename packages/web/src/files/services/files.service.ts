import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {SystemProvider, TokenService} from '@relate/common';
import {Application} from 'express';
import path from 'path';

const FILES_BASE_ENDPOINT = '/files';

@Injectable()
export class FilesService {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app: Application = httpAdapter.getInstance();

        app.get(
            `${FILES_BASE_ENDPOINT}/:fileToken/:fileName`,
            async (req, res): Promise<void> => {
                const {fileToken} = req.params;

                try {
                    const {projectName, directory, name} = await TokenService.verify(fileToken);
                    const environment = await this.systemProvider.getEnvironment();
                    const project = await environment.projects.get(projectName);

                    res.sendFile(path.join(project.root, directory, name));
                } catch (e) {
                    res.sendStatus(404);
                }
            },
        );
    }
}
