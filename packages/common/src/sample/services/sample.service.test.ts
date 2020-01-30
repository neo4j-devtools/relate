import {Test, TestingModule} from '@nestjs/testing';

import {SampleService} from './sample.service';
import {HelloService} from './hello.service';

describe('SampleService', () => {
    let service: SampleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SampleService, HelloService],
        }).compile();

        service = module.get(SampleService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
