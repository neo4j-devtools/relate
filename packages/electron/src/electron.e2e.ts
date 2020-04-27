import {INestApplication} from '@nestjs/common';
import {SystemProvider} from '@relate/common';
import {Test, TestingModule} from '@nestjs/testing';

import {ElectronModule} from './electron.module';

describe('ElectronModule', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ElectronModule],
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
