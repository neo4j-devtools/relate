import {INestApplication} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {SystemProvider} from '@relate/common';

import configuration from './configs/dev.config';
import {ElectronModule} from './electron.module';

describe('ElectronModule', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
                ElectronModule,
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('SystemProvider should be defined', () => {
        expect(app).toBeDefined();

        const provider = app.get(SystemProvider);

        expect(provider).toBeDefined();
    });
});
