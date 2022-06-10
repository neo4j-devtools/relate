import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {CliUx} from '@oclif/core';
import {SystemModule, SystemProvider} from '@relate/common';

import RestoreCommand from '../../commands/backup/restore';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class RestoreModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof RestoreCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const {backupIdOrPath, outputPath} = args;
        const backup = await environment.backups.get(backupIdOrPath).catch(() => null);
        const backupPath = backup ? backup.directory : backupIdOrPath;

        CliUx.ux.action.start(`Restoring backup from "${backupPath}".`);
        await environment.backups.restore(backupPath, outputPath).then((restored) => {
            CliUx.ux.action.stop();
            this.utils.log(
                outputPath
                    ? `Restored ${restored.entityType} ${restored.entityId} at ${outputPath}`
                    : `Restored ${restored.entityType} ${restored.entityId}`,
            );
        });
    }
}
