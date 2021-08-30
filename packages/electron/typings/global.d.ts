/* eslint-disable @typescript-eslint/no-unused-vars */
import {ConfigService} from '@nestjs/config';

declare module '@nestjs/config' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-shadow
    export class ConfigService<C = any, K = keyof C> {
        get<T extends K = K>(propertyPath: T): C[T];

        // eslint-disable-next-line no-dupe-class-members
        get<T extends K = K>(propertyPath: T, defaultValue: C[T]): C[T];
    }
}
