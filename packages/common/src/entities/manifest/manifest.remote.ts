import {NotSupportedError} from '../../errors';
import {ManifestModel, IManifest} from '../../models';
import {RemoteEnvironment} from '../environments';
import {ManifestAbstract} from './manifest.abstract';

export class ManifestRemote<Entity extends IManifest, Manifest extends ManifestModel<Entity>> extends ManifestAbstract<
    RemoteEnvironment,
    Entity,
    Manifest
> {
    public addTags(_nameOrId: string, _tags: string[]): Promise<Entity> {
        throw new NotSupportedError(`${ManifestRemote.name} does not support adding tags`);
    }

    public removeTags(_nameOrId: string, _tags: string[]): Promise<Entity> {
        throw new NotSupportedError(`${ManifestRemote.name} does not support removing tags`);
    }

    public get(_id: string): Promise<Manifest> {
        throw new NotSupportedError(`${ManifestRemote.name} does not support getting manifest`);
    }

    public update(_id: string, _update: Partial<Omit<Entity, 'id'>>): Promise<void> {
        throw new NotSupportedError(`${ManifestRemote.name} does not support updating manifest`);
    }
}
