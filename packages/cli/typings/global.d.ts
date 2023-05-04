/* eslint @typescript-eslint/no-explicit-any: 0 */
import {Parser} from '@oclif/core';
import {table as originalTable} from '@oclif/core/lib/cli-ux/styled/table';
import {InferredArgs, InferredFlags} from '@oclif/core/lib/interfaces';

type ParserInput = Parameters<typeof Parser.parse>[1];
type TFlags<C> = InferredFlags<C['flags'] & C['baseFlags']>;
type TArgs<C> = InferredArgs<C['args']>;

declare global {
    declare type ParsedInput<C> = {
        flags: TFlags<C>;
        args: TArgs<C>;
        argv: string[];
    };

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
    declare namespace ux {
        declare namespace Table {
            declare function table<T>(
                data: T[],
                columns: originalTable.Columns<T>,
                options?: originalTable.Options,
            ): void;
        }
    }
}
