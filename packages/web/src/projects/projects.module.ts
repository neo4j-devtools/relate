import {Module} from '@nestjs/common';

import {SystemModule} from '@relate/common';
import {ProjectsResolver} from './projects.resolver';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [ProjectsResolver],
})
export class ProjectsModule {}
