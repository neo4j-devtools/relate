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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        log: (message?: string | undefined, ...args: any[]) => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        debug: (...args: any[]) => void;
        error: (
            input: string | Error,
            options?:
                | {
                      code?: string;
                      exit?: number;
                  }
                | {
                      code?: string | undefined;
                      exit: false;
                  },
        ) => void;
    };
}
