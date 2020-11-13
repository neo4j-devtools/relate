import {ConfigModule} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';

import {SystemModule} from './system.module';
import {SystemProvider} from './system.provider';

describe('System Provider', () => {
    let provider: SystemProvider;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({isGlobal: true}), SystemModule.register()],
        }).compile();

        provider = module.get(SystemProvider);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
