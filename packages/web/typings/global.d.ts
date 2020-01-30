import {ConfigService} from '@nestjs/config';

declare module '@nestjs/config' {
    // eslint-disable-next-line no-shadow
    class ConfigService<C = any, K = keyof C> {
        get<T extends K = K>(propertyPath: T): C[T];

        // eslint-disable-next-line no-dupe-class-members
        get<T extends K = K>(propertyPath: T, defaultValue: C[T]): C[T];
    }
}
