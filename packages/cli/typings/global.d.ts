/* eslint @typescript-eslint/no-explicit-any: 0 */
import parser, {flags} from '@oclif/parser';

// https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
interface IHasFlags {
    flags: any;
}
type UnpackFlags<InputFlags> = InputFlags extends flags.Input<infer TFlags> ? TFlags : never;
type CommandToFlags<C> = C extends IHasFlags ? UnpackFlags<C['flags']> : {};

declare global {
    declare type ParsedInput<C> = parser.Output<CommandToFlags<C>, {[name: string]: any}>;
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
        exit: (code?: number) => void;
    };
}
