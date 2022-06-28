/* eslint @typescript-eslint/no-explicit-any: 0 */
import {Interfaces} from '@oclif/core';
import {table as originalTable} from '@oclif/core/lib/cli-ux/styled/table';

// https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
interface IHasFlags {
    flags: any;
}
type UnpackFlags<InputFlags> = InputFlags extends Interfaces.FlagInput<infer TFlags> ? TFlags : never;
type CommandToFlags<C> = C extends IHasFlags ? UnpackFlags<C['flags']> : Record<string, unknown>;

declare global {
    declare type ParsedInput<C> = Interfaces.ParserOutput<CommandToFlags<C>, {[name: string]: any}>;
    declare type CommandUtils = {
        log: (message?: string | undefined, ...args: any[]) => void;
        debug: (...args: any[]) => void;
        error: (
            input: string | Error,
            options?:
                | {
                      code?: string;
                      exit?: number;
                      suggestions?: string[];
                  }
                | {
                      code?: string | undefined;
                      exit: false;
                      suggestions?: string[];
                  },
        ) => void;
        warn: (input: string | Error) => void;
        exit: (code?: number) => void;
    };
}

declare module '@oclif/core' {
    declare namespace CliUx {
        declare namespace Table {
            declare function table<T>(
                data: T[],
                columns: originalTable.Columns<T>,
                options?: originalTable.Options,
            ): void;
        }
    }
}
