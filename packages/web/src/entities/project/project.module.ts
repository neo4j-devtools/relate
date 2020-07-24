import {Module} from '@nestjs/common';

import {SystemModule} from '@relate/common';
import {ProjectResolver} from './project.resolver';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [ProjectResolver],
})
export class ProjectModule {}
