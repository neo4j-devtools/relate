import {Test, TestingModule} from '@nestjs/testing';
import {SystemProvider, SystemModule} from '@relate/common';

describe('SampleService', () => {
    let provider: SystemProvider;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SystemModule],
        }).compile();

        provider = module.get(SystemProvider);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
