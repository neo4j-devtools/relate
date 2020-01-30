import {Module} from '@nestjs/common';

import {HelloElectronResolver} from './hello-electron.resolver';

@Module({
    providers: [HelloElectronResolver],
})
export class HelloElectronModule {}
